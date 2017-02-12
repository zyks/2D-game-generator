var TileMap = require('./../../components/tileMap');

var MapFromSchemaCreator = function(schema, squareSize = 10) {
    this.EMPTY_TILE = 0;
    this.WALL = 1;
    this._schema = schema;
    this._squareSize = squareSize;
    this._width = this._schema.squares[0].length * this._squareSize;
    this._height = this._schema.squares.length * this._squareSize;
    this._spawnPoints = [];
    this._doors = [];
    this._squareBuilders = {
        "oneEnemyRoom": (squareSize, edges, _) => { return this._buildEnemyRoom(squareSize, edges, 1); },
        "twoEnemyRoom": (squareSize, edges, _) => { return this._buildEnemyRoom(squareSize, edges, 2); },
        "threeEnemyRoom": (squareSize, edges, _) => { return this._buildEnemyRoom(squareSize, edges, 3); },
        "corridor": this._buildCorridor,
        "key": this._buildRoom,
        "door": this._buildDoor,
        "treasure": this._buildRoom
    }
}

MapFromSchemaCreator.prototype.create = function() {
    this._map = this._createEmptyMap(this._width, this._height, this.WALL);
    let y = 0;
    for(let i = 0 ; i < this._schema.squares.length ; i++) {
        let x = 0;
        for(let j = 0 ; j < this._schema.squares[i].length; j++) {
            let square = this._schema.squares[i][j];
            let edges = this._schema.edges[i][j];
            if(square && this._squareBuilders[square.name]) {
                let builtSquare = this._squareBuilders[square.name].bind(this)(this._squareSize, edges, square.references);
                this._putSquareOnMap(x, y, builtSquare.tiles);
                this._putSpawnPoints(x, y, builtSquare.enemySpawns);
                this._putDoors(x, y, builtSquare.doors);
            }
            x += this._squareSize;
        }
        y += this._squareSize;
    }
    console.log("Map from schema generated");
    return new TileMap(this._map, this._width, this._height, this._spawnPoints, this._doors);
}

MapFromSchemaCreator.prototype._putSquareOnMap = function(x, y, tiles) {
    for(let i = 0 ; i < tiles.length ; i++) {
        for(let j = 0 ; j < tiles[i].length; j++) {
            this._map[i+y][j+x] = tiles[i][j];
        }
    }
}

MapFromSchemaCreator.prototype._putSpawnPoints = function(x, y, spawnPoints) {
    if(!spawnPoints) return;
    for(let spawn of spawnPoints)
        this._spawnPoints.push({ x: x + spawn.x, y: y + spawn.y });
}

MapFromSchemaCreator.prototype._putDoors = function(x, y, doorsPoints) {
    if(!doorsPoints) return;
    for(let door of doorsPoints)
        this._doors.push({
            x: x + door.x,
            y: y + door.y,
            key: {
                x: door.key.pos.x * this._squareSize + this._squareSize * 0.5,
                y: door.key.pos.y * this._squareSize + this._squareSize * 0.5
            }
        });
}

MapFromSchemaCreator.prototype._buildRoom = function(squareSize, edges) {
    let tiles = this._createEmptyMap(squareSize, squareSize);
    for(let i = 0; i < squareSize; i++) {
        tiles[i][0] = tiles[0][i] = this.WALL;
        tiles[i][squareSize-1] = tiles[squareSize-1][i] = this.WALL;
    }
    for(let e of edges) {
        if(e.x == -1)
            for(let i = 0 ; i < 3 ; i++) tiles[i+4][0] = this.EMPTY_TILE;
        if(e.x == 1)
            for(let i = 0 ; i < 3 ; i++) tiles[i+4][squareSize-1] = this.EMPTY_TILE;
        if(e.y == -1)
            for(let i = 0 ; i < 3 ; i++) tiles[0][i+4] = this.EMPTY_TILE;
        if(e.y == 1)
            for(let i = 0 ; i < 3 ; i++) tiles[squareSize-1][i+4] = this.EMPTY_TILE;
    }
    return { tiles: tiles };
}

MapFromSchemaCreator.prototype._buildEnemyRoom = function(squareSize, edges, nbOfEnemies) {
    let square = this._buildRoom(squareSize, edges);
    let spawns = []
    while(nbOfEnemies) {
        x = Math.floor(Math.random() * squareSize);
        y = Math.floor(Math.random() * squareSize);
        if(square.tiles[y][x] == this.EMPTY_TILE) {
            spawns.push({ x: x, y: y });
            nbOfEnemies -= 1;
        }
    }
    return { tiles: square.tiles, enemySpawns: spawns };
}

MapFromSchemaCreator.prototype._buildDoor = function(squareSize, edges, references) {
    let square = this._buildCorridor(squareSize, edges);
    let spawns = []
    let half = Math.floor(squareSize/2);
    square.tiles[half][half] = this.EMPTY_TILE;
    square.tiles[half-1][half-1] = this.WALL;
    square.tiles[half+1][half-1] = this.WALL;
    square.tiles[half+1][half+1] = this.WALL;
    square.tiles[half-1][half+1] = this.WALL;
    let door = { x: half, y: half, key: references["key-door"] };
    return { tiles: square.tiles, doors: [door] };
}

MapFromSchemaCreator.prototype._buildCorridor = function(squareSize, edges) {
    let tiles = this._createEmptyMap(squareSize, squareSize, this.WALL);
    let half = Math.ceil(squareSize/2);
    for(let e of edges) {
        if(e.y == -1)
            for(let i = 0 ; i < half ; i++)
                tiles[i][half] = tiles[i][half-1] = tiles[i][half+1] = this.EMPTY_TILE;
        if(e.y == 1)
            for(let i = 0 ; i < half ; i++)
                tiles[i+half][half] = tiles[i+half][half-1] = tiles[i+half][half+1] = this.EMPTY_TILE;
        if(e.x == -1)
            for(let i = 0 ; i < half ; i++)
                tiles[half][i] = tiles[half-1][i] = tiles[half+1][i] = this.EMPTY_TILE;
        if(e.x == 1)
            for(let i = 0 ; i < half ; i++)
                tiles[half][i+half] = tiles[half-1][i+half] = tiles[half+1][i+half] = this.EMPTY_TILE;
    }
    return { tiles: tiles };
}

MapFromSchemaCreator.prototype._createEmptyMap = function(width, height, fill = this.EMPTY_TILE) {
    let map = new Array(width);
    for (var i = 0; i < height; i++) {
      map[i] = new Array(height).fill(fill);
    };
    return map
}

module.exports = MapFromSchemaCreator;
