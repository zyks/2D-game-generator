var SAT = require('sat');
var Config = require('../config');


// PlayerMapCollisionSystem
var PlayerCollisionSystem = function(engine) {
    this._engine = engine;
}

PlayerCollisionSystem.prototype.start = function() {

}

PlayerCollisionSystem.prototype.update = function(time) {
    let players = this._engine.entities.getByGroup('players');
    let mapLayers = this._engine.entities.getByGroup("mapLayers");
    for (let player of players) {
        for (let mapLayer of mapLayers) {
            let tileMap = mapLayer.components.get("TileMap");
            this._checkCollisionWithTileMap(player, tileMap);
        }
    }
}

PlayerCollisionSystem.prototype.end = function() {

}

PlayerCollisionSystem.prototype._checkCollisionWithTileMap = function(player, tileMap) {
    for (let column = 0; column < tileMap.width; column++)
        for (let row = 0; row < tileMap.height; row++)
            if (tileMap.tiles[column][row] === 1) // TODO: better wall checking
                this._checkCollisionWithTile(player, row, column);
}

PlayerCollisionSystem.prototype._checkCollisionWithTile = function(player, row, column) {
    let tileCenter = {
        x: row * Config.TILE_SIZE + 0.5 * Config.TILE_SIZE,
        y: column * Config.TILE_SIZE + 0.5 * Config.TILE_SIZE
    }
    let playerCenter = player.components.get("Position");
    let playerSquare = this._getPolygon(playerCenter, Config.TILE_SIZE);
    let tileSquare = this._getPolygon(tileCenter, Config.TILE_SIZE);
    let response = new SAT.Response();

    if (SAT.testPolygonPolygon(playerSquare, tileSquare, response))
        this._correctPlayerPosition(playerCenter, response);
}

PlayerCollisionSystem.prototype._getPolygon = function(position, size) {
    return new SAT.Box(
        new SAT.Vector(position.x, (-1) * position.y), 
        size, 
        size
    ).toPolygon();
}

PlayerCollisionSystem.prototype._correctPlayerPosition = function(playerPosition, response) {
    if (response.overlapN.x === 1 && response.overlapN.y === 0)
        playerPosition.x -= response.overlap;
    if (response.overlapN.x === -1 && response.overlapN.y === 0)
        playerPosition.x += response.overlap;
    if (response.overlapN.x === 0 && response.overlapN.y === 1)
        playerPosition.y += response.overlap;
    if (response.overlapN.x === 0 && response.overlapN.y === -1)
        playerPosition.y -= response.overlap;
}

module.exports = PlayerCollisionSystem;
