var TileMapGenerator = function() {
    this.EMPTY_TILE = 0;
    this.WALL = 1;
}

TileMapGenerator.prototype.generate = function(width, height) {
    this._width = width;
    this._height = height;
    this.initMap()
        .randomize()
        .cellularAutomata()
        .putBorders();
    return this._map;
}

TileMapGenerator.prototype.putBorders = function() {
    for(let i = 0 ; i < this._width ; i++)
        this._map[0][i] = this._map[this._height-1][i] = this.WALL;
    for(let i = 0 ; i < this._height ; i++)
        this._map[i][0] = this._map[i][this._width-1] = this.WALL;
    return this;
}

TileMapGenerator.prototype.randomize = function(emptyFactor = 0.5) {
    for(var i = 0; i < this._height; i++)
        for(var j = 0; j < this._width; j++) {
            this._map[i][j] = (Math.random() < emptyFactor ? this.EMPTY_TILE : this.WALL);
        }
    return this;
};

TileMapGenerator.prototype.cellularAutomata = function(iterations = 4) {
    while(iterations--)
        this._cellularAutomataStep();
    return this;
}

TileMapGenerator.prototype._cellularAutomataStep = function() {
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
            if(this._map[j][i] == this.WALL)
                map[j][i] = walls >= 4 ? this.WALL : this.EMPTY_TILE;
            if(this._map[j][i] == this.EMPTY_TILE)
                map[j][i] = walls > 4 ? this.WALL : this.EMPTY_TILE;
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
