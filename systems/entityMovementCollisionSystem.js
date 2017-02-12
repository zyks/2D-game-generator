var SAT = require('sat');
var Config = require('../config');
var Geometry = require('../components/geometry');


var EntityMovementCollisionSystem = function(engine) {
    this._engine = engine;
}

EntityMovementCollisionSystem.prototype.start = function() {

}

EntityMovementCollisionSystem.prototype.update = function(time) {
    let players = this._engine.entities.getByGroup('players');
    let enemies = this._engine.entities.getByGroup('enemies');
    let bullets = this._engine.entities.getByGroup('bullets');
    this._checkCollisionWithMap(players, this._correctEntityPosition);
    this._checkCollisionWithMap(enemies, this._correctEntityPosition);
    this._checkCollisionWithMap(bullets, this._removeEntity.bind(this));
    // this._checkCollisionWithCharacters(players, this._correctEntityPosition);
    this._checkCollisionWithCharacters(enemies, this._correctEntityPosition);
}

EntityMovementCollisionSystem.prototype.end = function() {

}


EntityMovementCollisionSystem.prototype._checkCollisionWithMap = function(entities, callback) {
    for (let entity of entities) {
        this._checkCollisionWithTiles(entity, callback);
        this._checkCollisionWithDoors(entity, callback);
        this._checkCollisionWithStaticElements(entity, callback);
    }
}

EntityMovementCollisionSystem.prototype._checkCollisionWithCharacters = function(entities, callback) {
    let characters = this._engine.entities.getByGroup("characters");
    for (let entity of entities)
        for (let character of characters) {
            if (character === entity) continue;
            let response = this._checkEntitiesCollision(entity, character)
            if (response.result)
                callback(entity, response);
        }
}

EntityMovementCollisionSystem.prototype._checkCollisionWithTiles = function(entity, callback) {
    let mapLayers = this._engine.entities.getByGroup("mapLayers");
    for (let mapLayer of mapLayers) {
        let tileMap = mapLayer.components.get("TileMap");
        this._checkCollisionWithTileMap(entity, tileMap, callback);
    }
}

EntityMovementCollisionSystem.prototype._checkCollisionWithTileMap = function(entity, tileMap, callback) {
    let position = entity.components.get("Position");
    let r = Math.max(Math.floor(position.x / Config.TILE_SIZE) - 1, 0);
    let c = Math.max(Math.floor(position.y / Config.TILE_SIZE) - 1, 0);
    for (let row = r; row < r + 3; row++)
        for (let column = c; column < c + 3; column++)
            if (tileMap.tiles[column][row] === 1) { // TODO: better wall checking
                let response = this._checkCollisionWithTile(entity, row, column);
                if (response.result)
                    callback(entity, response);
            }
}

EntityMovementCollisionSystem.prototype._checkCollisionWithDoors = function(entity, callback) {
    let doors = this._engine.entities.getByGroup('doors');
    for (let door of doors)
        if (door.components.get("DoorInfo").closed) {
            let response = this._checkEntitiesCollision(entity, door);
            if (response.result)
                callback(entity, response);
        }
}

EntityMovementCollisionSystem.prototype._checkCollisionWithStaticElements = function(entity, callback) {
    let elements = this._engine.entities.getByGroup('chests');
    for (let element of elements) {
        let response = this._checkEntitiesCollision(entity, element);
        if (response.result)
            callback(entity, response);
    }
}

EntityMovementCollisionSystem.prototype._checkCollisionWithTile = function(entity, row, column) {
    let tileSquare = this._getTileSquare(row, column);
    let entityGeometry = this._getEntityGeometry(entity);
    return entityGeometry.checkIntersection(tileSquare);
}

EntityMovementCollisionSystem.prototype._checkEntitiesCollision = function(entity1, entity2) {
    let entity1Geometry = this._getEntityGeometry(entity1);
    let entity2Geometry = this._getEntityGeometry(entity2);
    return entity1Geometry.checkIntersection(entity2Geometry);
}

EntityMovementCollisionSystem.prototype._correctEntityPosition = function(entity, response) {
    let entityPosition = entity.components.get("Position");

    if (response.overlapN.x === 1 && response.overlapN.y === 0)
        entityPosition.x -= response.overlap;
    if (response.overlapN.x === -1 && response.overlapN.y === 0)
        entityPosition.x += response.overlap;
    if (response.overlapN.x === 0 && response.overlapN.y === 1)
        entityPosition.y += response.overlap;
    if (response.overlapN.x === 0 && response.overlapN.y === -1)
        entityPosition.y -= response.overlap;
}

EntityMovementCollisionSystem.prototype._removeEntity = function(entity, response) {
    this._engine.entities.remove(entity);
}

EntityMovementCollisionSystem.prototype._getTileSquare = function(row, column) {
    let tileBottomLeft = {
        x: row * Config.TILE_SIZE,
        y: column * Config.TILE_SIZE + Config.TILE_SIZE
    }
    let tileSquare = new Geometry.Square(Config.TILE_SIZE);
    tileSquare.setPosition(tileBottomLeft.x, (-1) * tileBottomLeft.y);
    return tileSquare;
}

EntityMovementCollisionSystem.prototype._getEntityGeometry = function(entity) {
    let entityCenter = entity.components.get("Position");
    let entityGeometry = entity.components.get("Geometry");
    let shiftX = 0, shiftY = 0;
    if (entityGeometry instanceof Geometry.Square)
        shiftX = -0.5 * Config.TILE_SIZE, shiftY = 0.5 * Config.TILE_SIZE;
    entityGeometry.setPosition(entityCenter.x + shiftX, (-1) * (entityCenter.y + shiftY));
    return entityGeometry;
}


module.exports = EntityMovementCollisionSystem;
