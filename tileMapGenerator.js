var TileMap = require('./components/tileMap');

var TileMapGenerator = function() {
    this.EMPTY_TILE = 0;
    this.WALL = 1;
}

TileMapGenerator.prototype.generate = function(width, height, nbOfSpawns) {
    this._width = width;
    this._height = height;
    this.initMap()
        .putWalls()
        .generateSpawnPoints(nbOfSpawns)
        .generateDoors(10);
    return new TileMap(this._map, this._width, this._height, this._spawnPoints, this._doorPoints);
}

TileMapGenerator.prototype.generateSpawnPoints = function(nbOfSpawns) {
    this._spawnPoints = [];
    while(nbOfSpawns) {
        let x = Math.floor(Math.random() * this._width);
        let y = Math.floor(Math.random() * this._height);
        if(this._map[x][y] === this.EMPTY_TILE) {
            this._spawnPoints.push({ x: x, y: y });
            nbOfSpawns -= 1;
        }
    }
    return this;
}

TileMapGenerator.prototype.generateDoors = function(nbOfDoors) {
    this._doorPoints = [];
    while(nbOfDoors) {
        let x = Math.floor(Math.random() * this._width);
        let y = Math.floor(Math.random() * this._height);
        if(this._map[x][y] === this.EMPTY_TILE) {
            this._doorPoints.push({ x: x, y: y });
            nbOfDoors -= 1;
        }
    }
    return this;
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
