var Config = require('../Config');
var Viewport = require('../helpers/Viewport');

var TileMapRenderSystem = function(engine, ctx, atlas) {
    this._engine = engine;
    this._ctx = ctx;
    this._atlas = atlas;
}


TileMapRenderSystem.prototype.start = function() {

}

TileMapRenderSystem.prototype.update = function(deltaTime) {
    mapLayers = this._engine.entities.getByGroup("mapLayers");
    camera = this._engine.entities.getByName("camera");
    for(let layerEntity of mapLayers) {
        layer = layerEntity.components.get("TileMap");
        this._renderTiles(layer, camera);
    }
}

TileMapRenderSystem.prototype.end = function() {

}

TileMapRenderSystem.prototype._renderTiles = function(layer, camera) {
    viewport = new Viewport(layer, camera).renderContext();
    var y = viewport.viewportYOffset;
    for(let row = 0 ; row < viewport.nbOfRows ; row++) {
        var x = viewport.viewportXOffset;
        for(let column = 0 ; column < viewport.nbOfColumns ; column++) {
            tile = layer.tiles[row + viewport.startYTile][column + viewport.startXTile];
            this._renderTile(tile, x, y);
            x += Config.TILE_SIZE;
        }
        y += Config.TILE_SIZE;
    }
};

TileMapRenderSystem.prototype._renderTile = function (tile, x, y) {
    this._ctx.drawImage(
        this._atlas,
        Config.TILE_SIZE * tile, 0, Config.TILE_SIZE, Config.TILE_SIZE,
        x, y, Config.TILE_SIZE, Config.TILE_SIZE
    );
};

module.exports = TileMapRenderSystem;
