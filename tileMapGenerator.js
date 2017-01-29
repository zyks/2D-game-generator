var TileMapGenerator = function() {
    this.EMPTY_TILE = 0;
    this.WALL = 1;
}

TileMapGenerator.prototype.generate = function(width, height) {
    this._width = width;
    this._height = height;
    this.initMap()
        .putWalls();
    return this._map;
}

TileMapGenerator.prototype.putWalls = function() {
    wallsNb = Math.floor(Math.random() * this._width * this._height * 0.5);
    while(wallsNb) {
        x = Math.floor(Math.random() * this._width);
        y = Math.floor(Math.random() * this._height);
        this._map[x][y] = this.WALL;
        wallsNb -= 1;
    }
    return this;
};

TileMapGenerator.prototype.initMap = function() {
    this._map = new Array(this._width);
    for (var i = 0; i < this._width; i++) {
      this._map[i] = new Array(this._height).fill(this.EMPTY_TILE);
    };
    return this;
};

module.exports = TileMapGenerator;
