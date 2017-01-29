var SAT = require('sat');
var Config = require('../config');


// PlayerMapCollisionSystem
var PlayerCollisionSystem = function(engine) {
    this._engine = engine;
    this._nbOfRows = Math.ceil(Config.GAME_HEIGHT / Config.TILE_SIZE) + 1;
    this._nbOfColumns = Math.ceil(Config.GAME_WIDTH / Config.TILE_SIZE) + 1;
}

PlayerCollisionSystem.prototype.start = function() {

}

PlayerCollisionSystem.prototype.update = function(time) {
    let players = this._engine.entities.getByGroup('players');
    let mapLayers = this._engine.entities.getByGroup("mapLayers");
    for (let player of players) {
        for (let mapLayer of mapLayers) {
            let tileMap = mapLayer.components.get("TileMap");
            this._checkCollisionWithTiles(player, tileMap.tiles);
        }
    }
}

PlayerCollisionSystem.prototype.end = function() {

}

PlayerCollisionSystem.prototype._checkCollisionWithTiles = function(player, tiles) {
    for (let row = 0; row < this._nbOfRows; row++)
        for (let column = 0; column < this._nbOfColumns; column++)
            if (tiles[row][column] === 1) // TODO: better wall checking
                this._checkCollisionWithTile(player, row, column);
}

PlayerCollisionSystem.prototype._checkCollisionWithTile = function(player, row, column) {
    let tileCenter = {
        x: row * Config.TILE_SIZE + 0.5 * Config.TILE_SIZE,
        y: column * Config.TILE_SIZE + 0.5 * Config.TILE_SIZE
    }
    let playerPosition = player.components.get("Position");
    let playerSquare = new SAT.Box(
        new SAT.Vector(playerPosition.x, (-1) * playerPosition.y), 
        Config.TILE_SIZE, 
        Config.TILE_SIZE
    ).toPolygon();
    let tileSquare = new SAT.Box(
        new SAT.Vector(tileCenter.x, (-1) * tileCenter.y),
        Config.TILE_SIZE,
        Config.TILE_SIZE
    ).toPolygon();
    let response = new SAT.Response();
    if (SAT.testPolygonPolygon(playerSquare, tileSquare, response)) {
        // console.log(
        //     `Collision with (${row}, ${column}); 
        //     player: (${playerPosition.x}, ${-1 * playerPosition.y})
        //     tile: (${tileCenter.x}, ${tileCenter.y})
        //     response: ${response.overlapN.x}, ${response.overlapN.y}, ${response.overlap}`
        // );
        console.log("COLLISION");
        if (response.overlapN.x === 1 && response.overlapN.y === 0)
            playerPosition.x -= response.overlap;
        if (response.overlapN.x === -1 && response.overlapN.y === 0)
            playerPosition.x += response.overlap;
        if (response.overlapN.x === 0 && response.overlapN.y === 1)
            playerPosition.y += response.overlap;
        if (response.overlapN.x === 0 && response.overlapN.y === -1)
            playerPosition.y -= response.overlap;

    }
}


PlayerCollisionSystem.prototype._getSquareForTile = function(tile) {

}




module.exports = PlayerCollisionSystem;
