var GrammarProductions = require('./GrammarProductions');

var MapSchemaCreator = function() {
    this._productions = GrammarProductions;
}

MapSchemaCreator.prototype.create = function(width, height) {
    this._width = width;
    this._height = height;
    this.squares = this._createEmptySchema(this._height, this._width, null);
    this.edges = this._createEmptyEdgesSchema(this._height, this._width);
    this.squares[2][2] = "Start";
    this.nonTerminalsPos = [[2,2]];
    while(this.nonTerminalsPos.length > 0) {
        let nonTerminalPos = this.nonTerminalsPos.shift();
        let nonTerminal = this.squares[nonTerminalPos[0]][nonTerminalPos[1]];
        let availablePositions = this._getFreeNeighbours(nonTerminalPos[1], nonTerminalPos[0]);
        availablePositions.push(nonTerminalPos);
        let availableProductions = this._productions[nonTerminal].filter((production) => {
            return production.nonTerminals.length <= availablePositions.length;
        });
        let production = this._pickProduction(availableProductions);
        console.log(nonTerminal, " --> ", production.nonTerminals);
        for(let t of production.nonTerminals) {
            let pos = availablePositions.pop();
            this.squares[pos[0]][pos[1]] = t;
            if(t[0] == t[0].toUpperCase())
                this.nonTerminalsPos.push(pos);
            if(pos[0] != nonTerminalPos[0] || pos[1] != nonTerminalPos[1]) {
                let dY = pos[0] - nonTerminalPos[0];
                let dX = pos[1] - nonTerminalPos[1];
                this.edges[nonTerminalPos[0]][nonTerminalPos[1]].push({ x: dX, y: dY });
                this.edges[pos[0]][pos[1]].push({ x: -dX, y: -dY });
            }
        }
    }
    console.log(this.edges)
    console.log(this.squares);
    return { squares: this.squares, edges: this.edges };
}

MapSchemaCreator.prototype._pickProduction = function(productions) {
    if(productions.length == 1)
        return productions[0];
    let availableProductions = [];
    do {
        let treshold = Math.random();
        availableProductions = productions.filter((production) => {
            return production.probability >= treshold;
        });
    } while(availableProductions.length == 0);
    return this._pickRandom(availableProductions);
}

MapSchemaCreator.prototype._pickRandom = function(array) {
    return array[Math.floor(Math.random()*array.length)];
}

MapSchemaCreator.prototype._getFreeNeighbours = function(x, y) {
    let dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    let freeNeighbours = [];
    for(let d of dirs) {
        let newX = x + d[1];
        let newY = y + d[0];
        if(newX >= 0 && newX < this._width && newY >= 0 && newY < this._height && !this.squares[newY][newX])
            freeNeighbours.push([newY, newX]);
    }
    return freeNeighbours;
};

MapSchemaCreator.prototype._createEmptyEdgesSchema = function(width, height) {
    let map = new Array(width);
    for (var i = 0; i < height; i++) {
        map[i] = new Array(height);
        for(var j = 0 ; j < height ; j++)
            map[i][j] = [];
    };
    return map
}

MapSchemaCreator.prototype._createEmptySchema = function(width, height, fill) {
    let map = new Array(width);
    for (var i = 0; i < height; i++) {
      map[i] = new Array(height).fill(fill);
    };
    return map
}

module.exports = MapSchemaCreator;
