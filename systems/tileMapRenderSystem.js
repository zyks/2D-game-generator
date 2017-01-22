var TileMapRenderSystem = function(engine, ctx, atlas) {
    this._engine = engine;
    this._ctx = ctx;
    this._atlas = atlas;
    this.TILE_SIZE = 48;
}


TileMapRenderSystem.prototype.start = function() {

}

TileMapRenderSystem.prototype.update = function(deltaTime) {
    mapLayers = this._engine.entities.getByGroup("mapLayers");
    for(let layerEntity of mapLayers) {
        layer = layerEntity.components.get("TileMap");
        tiles = layer.tiles;
        this._renderTiles(tiles);
    }
}

TileMapRenderSystem.prototype.end = function() {

}

TileMapRenderSystem.prototype._renderTiles = function(tiles) {
    var y = 0;
    for(let row of tiles) {
        var x = 0;
        for(let tile of row) {
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
