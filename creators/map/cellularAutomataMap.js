var CellularAutomataMap = function() {
    this.EMPTY_TILE = 0;
    this.WALL = 1;
    this.DOOR = 2;
}

CellularAutomataMap.prototype.run = function(map, steps) {
    this._map = map;
    this._width = map[0].length;
    this._height = map.length;
    this.cellularAutomata(steps)
        .putBorders()
        .putDoorsBorders();
    return this._map;
}

CellularAutomataMap.prototype.putBorders = function() {
    for(let i = 0 ; i < this._width ; i++)
        this._map[0][i] = this._map[this._height-1][i] = this.WALL;
    for(let i = 0 ; i < this._height ; i++)
        this._map[i][0] = this._map[i][this._width-1] = this.WALL;
    return this;
}

CellularAutomataMap.prototype.putDoorsBorders = function() {
    for(var i = 0; i < this._height; i++)
        for(var j = 0; j < this._width; j++)
            if(this._map[i][j] == this.DOOR) {
                this._map[i][j] = this.EMPTY_TILE;
                for(var k = 1 ; k <= 3 ; k++) {
                    this._map[i-k][j-k] = this.WALL;
                    this._map[i+k][j-k] = this.WALL;
                    this._map[i+k][j+k] = this.WALL;
                    this._map[i-k][j+k] = this.WALL;
                }
            }
    return this;
}

CellularAutomataMap.prototype.cellularAutomata = function(iterations) {
    while(iterations--)
        this._cellularAutomataStep();
    return this;
}

CellularAutomataMap.prototype._cellularAutomataStep = function() {
    let map = this.createEmptyMap(this._width, this._height);
    for(var i = 0; i < this._height; i++) {
        for(var j = 0; j < this._width; j++) {
            let walls = this._calculateNeighbours(j, i, this.WALL);
            if(this._map[j][i] == this.DOOR)
                map[j][i] = this.DOOR;
            else if(this._map[j][i] == this.WALL)
                map[j][i] = walls >= 4 ? this.WALL : this.EMPTY_TILE;
            else if(this._map[j][i] == this.EMPTY_TILE)
                map[j][i] = walls > 4 ? this.WALL : this.EMPTY_TILE;
        }
    }
    this._map = map;
}

CellularAutomataMap.prototype._calculateNeighbours = function(x, y, tile) {
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

CellularAutomataMap.prototype.createEmptyMap = function(width, height, fill = this.EMPTY_TILE) {
    let map = new Array(width);
    for (var i = 0; i < height; i++) {
      map[i] = new Array(height).fill(this.EMPTY_TILE);
    };
    return map
}

module.exports = CellularAutomataMap;
