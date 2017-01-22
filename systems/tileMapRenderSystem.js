var TileMapRenderSystem = function(engine, ctx, atlas) {
    this._engine = engine;
    this._ctx = ctx;
    this._atlas = atlas;
    this.TILE_SIZE = 48;
    this.GAME_WIDTH = 800;
    this.GAME_HEIGHT = 600;
}


TileMapRenderSystem.prototype.start = function() {

}

TileMapRenderSystem.prototype.update = function(deltaTime) {
    mapLayers = this._engine.entities.getByGroup("mapLayers");
    camera = this._engine.entities.getByName("camera");
    for(let layerEntity of mapLayers) {
        layer = layerEntity.components.get("TileMap");
        tiles = layer.tiles;
        this._renderTiles(tiles, camera);
    }
}

TileMapRenderSystem.prototype.end = function() {

}

TileMapRenderSystem.prototype._getViewportContext = function(camera) {
    var ViewportContext = function(camera, TILE_SIZE, GAME_WIDTH, GAME_HEIGHT) {
        cameraPosition = camera.components.get("Position");
        this.viewportXStart = cameraPosition.x - Math.floor(GAME_WIDTH / 2);
        this.viewportXStart = this.viewportXStart > 0 ? this.viewportXStart : 0;
        this.viewportYStart = cameraPosition.y - Math.floor(GAME_HEIGHT / 2);
        this.viewportYStart = this.viewportYStart > 0 ? this.viewportYStart : 0;
        this.startXTile = Math.floor(this.viewportXStart / TILE_SIZE);
        this.startYTile = Math.floor(this.viewportYStart / TILE_SIZE);
        this.viewportXOffset = this.startXTile * TILE_SIZE - this.viewportXStart;
        this.viewportYOffset = this.startYTile * TILE_SIZE - this.viewportYStart;
    }
    return new ViewportContext(camera, this.TILE_SIZE, this.GAME_WIDTH, this.GAME_HEIGHT);
};

TileMapRenderSystem.prototype._renderTiles = function(tiles, camera) {
    viewport = this._getViewportContext(camera);
    var y = viewport.viewportYOffset;
    for(let row = 0 ; row < 15 ; row++) {
        var x = viewport.viewportXOffset;
        for(let column = 0 ; column < 19 ; column++) {
            tile = tiles[column + viewport.startXTile][row + viewport.startYTile];
            this._renderTile(tile, x, y);
            x += this.TILE_SIZE;
        }
        y += this.TILE_SIZE;
    }
};

TileMapRenderSystem.prototype._renderTile = function (tile, x, y) {
    this._ctx.drawImage(
        this._atlas,
        this.TILE_SIZE * tile, 0, this.TILE_SIZE, this.TILE_SIZE,
        x, y, this.TILE_SIZE, this.TILE_SIZE
    );
};

module.exports = TileMapRenderSystem;
