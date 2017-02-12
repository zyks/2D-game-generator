var TileMap = require('./../../components/tileMap');

var MapFromSchemaCreator = function(schema, squareSize = 10) {
    this.EMPTY_TILE = 0;
    this.WALL = 1;
    this._schema = schema;
    this._squareSize = squareSize;
    this._width = this._schema.squares[0].length * this._squareSize;
    this._height = this._schema.squares.length * this._squareSize;
    this._squareBuilders = {
        "oneEnemyRoom": this._buildRoom,
        "twoEnemyRoom": this._buildRoom,
        "threeEnemyRoom": this._buildRoom,
        "corridor": this._buildCorridor,
        "key": this._buildRoom,
        "door": this._buildRoom,
        "treasure": this._buildRoom,
    }
}

MapFromSchemaCreator.prototype.create = function() {
    this._map = this._createEmptyMap(this._width, this._height, this.WALL);
    let y = 0;
    for(let i = 0 ; i < this._schema.squares.length ; i++) {
        let x = 0;
        for(let j = 0 ; j < this._schema.squares[i].length; j++) {
            let squareName = this._schema.squares[i][j];
            let edges = this._schema.edges[i][j];
            if(this._squareBuilders[squareName]) {
                let square = this._squareBuilders[squareName].bind(this)(this._squareSize, edges);
                this._putSquareOnMap(x, y, square);
            }
            x += this._squareSize;
        }
        y += this._squareSize;
    }
    return new TileMap(this._map, this._width, this._height, []);
}

MapFromSchemaCreator.prototype._putSquareOnMap = function(x, y, square) {
    for(let i = 0 ; i < square.length ; i++) {
        for(let j = 0 ; j < square[i].length; j++) {
            this._map[i+y][j+x] = square[i][j];
        }
    }
}

MapFromSchemaCreator.prototype._buildRoom = function(squareSize, edges) {
    let square = this._createEmptyMap(squareSize, squareSize);
    for(let i = 0; i < squareSize; i++) {
        square[i][0] = square[0][i] = this.WALL;
        square[i][squareSize-1] = square[squareSize-1][i] = this.WALL;
    }
    for(let e of edges) {
        if(e.x == -1)
            for(let i = 0 ; i < 3 ; i++) square[i+4][0] = this.EMPTY_TILE;
        if(e.x == 1)
            for(let i = 0 ; i < 3 ; i++) square[i+4][squareSize-1] = this.EMPTY_TILE;
        if(e.y == -1)
            for(let i = 0 ; i < 3 ; i++) square[0][i+4] = this.EMPTY_TILE;
        if(e.y == 1)
            for(let i = 0 ; i < 3 ; i++) square[squareSize-1][i+4] = this.EMPTY_TILE;
    }
    return square;
}

MapFromSchemaCreator.prototype._buildCorridor = function(squareSize, edges) {
    let square = this._createEmptyMap(squareSize, squareSize, this.WALL);
    let half = Math.ceil(squareSize/2);
    for(let e of edges) {
        if(e.y == -1)
            for(let i = 0 ; i < half ; i++)
                square[i][half] = square[i][half-1] = square[i][half+1] = this.EMPTY_TILE;
        if(e.y == 1)
            for(let i = 0 ; i < half ; i++)
                square[i+half][half] = square[i+half][half-1] = square[i+half][half+1] = this.EMPTY_TILE;
        if(e.x == -1)
            for(let i = 0 ; i < half ; i++)
                square[half][i] = square[half-1][i] = square[half+1][i] = this.EMPTY_TILE;
        if(e.x == 1)
            for(let i = 0 ; i < half ; i++)
                square[half][i+half] = square[half-1][i+half] = square[half+1][i+half] = this.EMPTY_TILE;
    }
    return square;
}

MapFromSchemaCreator.prototype._createEmptyMap = function(width, height, fill = this.EMPTY_TILE) {
    let map = new Array(width);
    for (var i = 0; i < height; i++) {
      map[i] = new Array(height).fill(fill);
    };
    return map
}

module.exports = MapFromSchemaCreator;
