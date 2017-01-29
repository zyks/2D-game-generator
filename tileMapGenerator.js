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
  for(var i = 0; i < this._height; i++)
      for(var j = 0; j < this._width; j++) {
          this._map[i][j] = (Math.random() < 0.5 ? this.EMPTY_TILE : this.WALL);
      }
    this.cellular();
    this.cellular();
    this.cellular();
    this.cellular();
    return this;
};

TileMapGenerator.prototype.cellular = function( ) {
    let dirs = [
      { x: -1, y: -1},
      { x: -1, y:  0},
      { x: -1, y:  1},
      { x:  0, y: -1},
      { x:  0, y:  1},
      { x:  1, y: -1},
      { x:  1, y:  0},
      { x:  1, y:  1}
    ];
    let map = new Array(this._width);
    for (var i = 0; i < this._width; i++) {
      map[i] = new Array(this._height).fill(this.EMPTY_TILE);
    };
    for(var i = 0; i < this._height; i++) {
        for(var j = 0; j < this._width; j++) {
            let walls = 0;
            for(let d of dirs) {
               let newX = j + d.x;
               let newY = i + d.y;
               if(newY >= 0 && newY < this._height && newX >= 0 && newX < this._width && this._map[newX][newY])
                    walls += 1;
            }
            if(this._map[j][i] == this.WALL && walls >= 4)
                map[j][i] = this.WALL;
            if(this._map[j][i] == this.EMPTY_TILE && walls >= 5)
                map[j][i] = this.EMPTY_TILE;
        }
    }
    this._map = map;
}

TileMapGenerator.prototype.initMap = function() {
    this._map = new Array(this._width);
    for (var i = 0; i < this._width; i++) {
      this._map[i] = new Array(this._height).fill(this.EMPTY_TILE);
    };
    return this;
};

module.exports = TileMapGenerator;
