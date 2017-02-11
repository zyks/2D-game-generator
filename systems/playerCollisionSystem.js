var SAT = require('sat');
var Config = require('../config');
var Geometry = require('../components/geometry');


var PlayerCollisionSystem = function(engine) {
    this._engine = engine;
}

PlayerCollisionSystem.prototype.start = function() {

}

PlayerCollisionSystem.prototype.update = function(time) {
    let players = this._engine.entities.getByGroup('players');
    for (let player of players) {
        this._checkCollisionWithMap(player);
        this._checkCollisionWithDoors(player);
        this._checkCollisionWithStaticEntities(player);
    }
}

PlayerCollisionSystem.prototype.end = function() {

}

PlayerCollisionSystem.prototype._checkCollisionWithMap = function(player) {
    let mapLayers = this._engine.entities.getByGroup("mapLayers");
    for (let mapLayer of mapLayers) {
        let tileMap = mapLayer.components.get("TileMap");
        this._checkCollisionWithTileMap(player, tileMap);
    }
}

PlayerCollisionSystem.prototype._checkCollisionWithTileMap = function(player, tileMap) {
    for (let column = 0; column < tileMap.width; column++)
        for (let row = 0; row < tileMap.height; row++)
            if (tileMap.tiles[column][row] === 1) { // TODO: better wall checking
                let tileSquare = this._getTileSquare(row, column);
                this._checkCollisionWithTile(player, tileSquare);
            }
}

PlayerCollisionSystem.prototype._checkCollisionWithTile = function(player, tileSquare) {
    let playerSquare = this._getEntityGeometry(player);
    let response = playerSquare.checkIntersection(tileSquare);
    if (response.result)
        this._correctPlayerPosition(player, response);
}

PlayerCollisionSystem.prototype._checkCollisionWithDoors = function(player) {
    let doors = this._engine.entities.getByGroup('doors');
    for (let door of doors)
        if (door.components.get("DoorInfo").closed)
            this._checkCollisionWithSquareEntity(player, door);
}

PlayerCollisionSystem.prototype._checkCollisionWithStaticEntities = function(player) {
    let entities = this._engine.entities.getByGroup('chests');
    for (let entity of entities)
        this._checkCollisionWithSquareEntity(player, entity);
}

PlayerCollisionSystem.prototype._checkCollisionWithSquareEntity = function(player, entity) {
    let playerSquare = this._getEntityGeometry(player);
    let entitySquare = this._getEntityGeometry(entity);
    let response = playerSquare.checkIntersection(entitySquare);
    if (response.result)
        this._correctPlayerPosition(player, response);
}

PlayerCollisionSystem.prototype._correctPlayerPosition = function(player, response) {
    let playerPosition = player.components.get("Position");

    if (response.overlapN.x === 1 && response.overlapN.y === 0)
        playerPosition.x -= response.overlap;
    if (response.overlapN.x === -1 && response.overlapN.y === 0)
        playerPosition.x += response.overlap;
    if (response.overlapN.x === 0 && response.overlapN.y === 1)
        playerPosition.y += response.overlap;
    if (response.overlapN.x === 0 && response.overlapN.y === -1)
        playerPosition.y -= response.overlap;
}

PlayerCollisionSystem.prototype._getTileSquare = function(row, column) {
    let tileCenter = {
        x: row * Config.TILE_SIZE + 0.5 * Config.TILE_SIZE,
        y: column * Config.TILE_SIZE + 0.5 * Config.TILE_SIZE
    }
    let tileSquare = new Geometry.Square(Config.TILE_SIZE);
    tileSquare.setPosition(tileCenter.x, (-1) * tileCenter.y);
    return tileSquare;
}

PlayerCollisionSystem.prototype._getEntityGeometry = function(entity) {
    let entityCenter = entity.components.get("Position");
    let entityGeometry = entity.components.get("Geometry");
    entityGeometry.setPosition(entityCenter.x, (-1) * entityCenter.y);
    return entityGeometry;
}


module.exports = PlayerCollisionSystem;
