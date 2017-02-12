var Config = require('../Config');
var Rect = require('./../engine/gfx/rect');

var MiniMapRenderSystem = function(engine, ctx, atlas) {
    this._engine = engine;
    this._ctx = ctx;
    this._atlas = atlas;
    this._tileSize = 4;
    this._x = 30;
    this._y = 20;
}

MiniMapRenderSystem.prototype.start = function() {

}

MiniMapRenderSystem.prototype.update = function(deltaTime) {
    this._renderLayers();
    this._renderEnemies();
    this._renderPlayers();
    this._renderChests();
}

MiniMapRenderSystem.prototype.end = function() {
    // TODO: remove miniMapCanvas
}

MiniMapRenderSystem.prototype._renderLayers = function() {
    if(!this._miniMapCtx) {
        let mapLayers = this._engine.entities.getByGroup("mapLayers");
        width = mapLayers[0].components.get("TileMap").width;
        height = mapLayers[0].components.get("TileMap").height;
        this._initMiniMapCtx(width * this._tileSize, height * this._tileSize);
        for(let layerEntity of mapLayers) {
            let layer = layerEntity.components.get("TileMap");
            this._renderTiles(layer);
        }
    }
    this._ctx.drawImage(this._miniMapCanvas, this._x, this._y);
}

MiniMapRenderSystem.prototype._initMiniMapCtx = function(width, height) {
    this._miniMapCanvas = document.createElement("canvas");
    this._miniMapCanvas.width = width;
    this._miniMapCanvas.height = height;
    this._miniMapCtx = this._miniMapCanvas.getContext('2d');
}

MiniMapRenderSystem.prototype._renderTiles = function(layer) {
    let y = 0;
    for(let row = 0 ; row < layer.height ; row++) {
        let x = 0;
        for(let column = 0 ; column < layer.width ; column++) {
            this._renderTile(layer.tiles[row][column], x, y);
            x += this._tileSize;
        }
        y += this._tileSize;
    }
};

MiniMapRenderSystem.prototype._renderTile = function (tile, x, y) {
    this._miniMapCtx.drawImage(
        this._atlas,
        Config.TILE_SIZE * tile, 0, Config.TILE_SIZE, Config.TILE_SIZE,
        x, y, this._tileSize, this._tileSize
    );
};

MiniMapRenderSystem.prototype._renderEnemies = function() {
    let enemies = this._engine.entities.getByGroup('enemies');
    for (let enemy of enemies)
        this._renderEntity(enemy, "green");
}

MiniMapRenderSystem.prototype._renderChests = function() {
    let chests = this._engine.entities.getByGroup('chests');
    for (let chest of chests)
        this._renderEntity(chest, "brown");
}

MiniMapRenderSystem.prototype._renderPlayers = function() {
    let players = this._engine.entities.getByGroup('players');
    for (let player of players)
        this._renderEntity(player, "yellow");
}

MiniMapRenderSystem.prototype._renderEntity = function (entity, color) {
    let rect = new Rect(0, 0, this._tileSize, this._tileSize).fill(color);
    let position = entity.components.get("Position");
    let x = Math.floor(position.x / Config.TILE_SIZE * this._tileSize) - this._tileSize/2 + this._x;
    let y = Math.floor(position.y / Config.TILE_SIZE * this._tileSize) - this._tileSize/2 + this._y;
    rect.render(this._ctx, x, y);
};

module.exports = MiniMapRenderSystem;
