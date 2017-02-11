var TileMap = require('./components/tileMap');

var TileMapGenerator = function() {
    this.EMPTY_TILE = 0;
    this.WALL = 1;
}

TileMapGenerator.prototype.generate = function(width, height, nbOfSpawns) {
    this._width = width;
    this._height = height;
    this.initMap()
        .randomize()
        .putBorders()
        .cellularAutomata(5)
        .putBorders()
        .generateSpawnPoints(nbOfSpawns);
    return new TileMap(this._map, this._width, this._height, this._spawnPoints);
}

TileMapGenerator.prototype.generateSpawnPoints = function(nbOfSpawns) {
    this._spawnPoints = [];
    while(nbOfSpawns) {
        x = Math.floor(Math.random() * this._width);
        y = Math.floor(Math.random() * this._height);
        if(this._map[x][y] == this.EMPTY_TILE) {
            this._spawnPoints.push({ x: x, y: y });
            nbOfSpawns -= 1;
        }
    }
    return this;
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
    let map = this.createEmptyMap(this._width, this._height);
    for(var i = 0; i < this._height; i++) {
        for(var j = 0; j < this._width; j++) {
            let walls = this._calculateNeighbours(j, i, this.WALL);
            if(this._map[j][i] == this.WALL)
                map[j][i] = walls >= 4 ? this.WALL : this.EMPTY_TILE;
            if(this._map[j][i] == this.EMPTY_TILE)
                map[j][i] = walls > 4 ? this.WALL : this.EMPTY_TILE;
        }
    }
    this._map = map;
}

TileMapGenerator.prototype._calculateNeighbours = function(x, y, tile) {
    let dirs = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
    let res = 0;
    for(let d of dirs) {
       let newX = x + d[0];
       let newY = y + d[1];
       if(newY >= 0 && newY < this._height && newX >= 0 && newX < this._width && this._map[newX][newY] == tile)
            res += 1;
    }
    return res;
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
    this._map = this.createEmptyMap(this._width, this._height);
    return this;
};

TileMapGenerator.prototype.createEmptyMap = function(width, height) {
    let map = new Array(width);
    for (var i = 0; i < height; i++) {
      map[i] = new Array(height).fill(this.EMPTY_TILE);
    };
    return map
}

module.exports = TileMapGenerator;
