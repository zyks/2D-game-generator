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
    this.nonTerminalsPos = [{ x: 2, y: 2 }];
    while(this.nonTerminalsPos.length > 0) {
        let nonTerminalPos = this.nonTerminalsPos.shift();
        let nonTerminal = this.squares[nonTerminalPos.y][nonTerminalPos.x];
        this._processNonTerminal(nonTerminal, nonTerminalPos);
    }
    console.log(this.squares);
    return { squares: this.squares, edges: this.edges };
}

MapSchemaCreator.prototype._processNonTerminal = function(nonTerminal, nonTerminalPos) {
    let availablePositions = this._getFreeNeighbours(nonTerminalPos.x, nonTerminalPos.y);
    availablePositions.push(nonTerminalPos);
    let availableProductions = this._getAvailableProductions(nonTerminal, availablePositions);
    let production = this._pickProduction(availableProductions);
    console.log(nonTerminal, " --> ", production.nonTerminals);
    for(let t of production.nonTerminals) {
        let pos = availablePositions.pop();
        this.squares[pos.y][pos.x] = t;
        if(this._isNonTerminal(t))
            this.nonTerminalsPos.push(pos);
        this._updateEdges(pos, nonTerminalPos);
    }
}

MapSchemaCreator.prototype._isNonTerminal = function(t) {
    return t[0] == t[0].toUpperCase();
}

MapSchemaCreator.prototype._getAvailableProductions = function(nonTerminal, availablePositions) {
    return this._productions[nonTerminal].filter((production) => {
        return production.nonTerminals.length <= availablePositions.length;
    });
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

MapSchemaCreator.prototype._updateEdges = function(pos, nonTerminalPos) {
    if(pos.y != nonTerminalPos.y || pos.x != nonTerminalPos.x) {
        let dY = pos.y - nonTerminalPos.y;
        let dX = pos.x - nonTerminalPos.x;
        this.edges[nonTerminalPos.y][nonTerminalPos.x].push({ x: dX, y: dY });
        this.edges[pos.y][pos.x].push({ x: -dX, y: -dY });
    }
}

MapSchemaCreator.prototype._getFreeNeighbours = function(x, y) {
    let dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    let freeNeighbours = [];
    for(let d of dirs) {
        let newX = x + d[1];
        let newY = y + d[0];
        if(newX >= 0 && newX < this._width && newY >= 0 && newY < this._height && !this.squares[newY][newX])
            freeNeighbours.push({ y: newY, x: newX });
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
