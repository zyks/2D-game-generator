var Config = require('../Config');

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

TileMapRenderSystem.prototype._getViewportContext = function(camera, layer) {
    var ViewportContext = function(camera, map) {
        cameraPosition = camera.components.get("Position");
        this.viewportXStart = cameraPosition.x - Math.floor(Config.GAME_WIDTH / 2);
        this.viewportXStart = Math.max(0, this.viewportXStart);
        this.viewportXStart = Math.min(layer.width * Config.TILE_SIZE - Config.GAME_WIDTH, this.viewportXStart);
        this.viewportYStart = cameraPosition.y - Math.floor(Config.GAME_HEIGHT / 2);
        this.viewportYStart = Math.max(0, this.viewportYStart);
        this.viewportYStart = Math.min(layer.height * Config.TILE_SIZE - Config.GAME_HEIGHT, this.viewportYStart);
        this.startXTile = Math.floor(this.viewportXStart / Config.TILE_SIZE);
        this.startYTile = Math.floor(this.viewportYStart / Config.TILE_SIZE);
        this.viewportXOffset = this.startXTile * Config.TILE_SIZE - this.viewportXStart;
        this.viewportYOffset = this.startYTile * Config.TILE_SIZE - this.viewportYStart;
        this.nbOfRows = Math.ceil(Config.GAME_HEIGHT / Config.TILE_SIZE) + 1;
        this.nbOfColumns = Math.ceil(Config.GAME_WIDTH / Config.TILE_SIZE) + 1;
    }
    return new ViewportContext(camera, layer);
};

TileMapRenderSystem.prototype._renderTiles = function(layer, camera) {
    viewport = this._getViewportContext(camera, layer);
    var y = viewport.viewportYOffset;
    for(let row = 0 ; row < viewport.nbOfRows ; row++) {
        var x = viewport.viewportXOffset;
        for(let column = 0 ; column < viewport.nbOfColumns ; column++) {
            tile = layer.tiles[column + viewport.startXTile][row + viewport.startYTile];
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
