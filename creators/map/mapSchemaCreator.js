var GrammarProductions = require('./GrammarProductions');

var MapSchemaCreator = function() {
    this._productions = GrammarProductions;
}

MapSchemaCreator.prototype.create = function(width, height, startX, startY) {
    let startPos = { x: startX, y: startY };
    let startNonTerminal = { name: "Start", pos: startPos, references: {} };
    this._width = width;
    this._height = height;
    this.squares = this._createEmptySchema(this._height, this._width, null);
    this.edges = this._createEmptyEdgesSchema(this._height, this._width);
    this.squares[startPos.y][startPos.x] = startNonTerminal;
    this.nonTerminals = [startNonTerminal];
    while(this.nonTerminals.length > 0) {
        let nonTerminal = this.nonTerminals.shift();
        this._processNonTerminal(nonTerminal);
    }
    return { squares: this.squares, edges: this.edges };
}

MapSchemaCreator.prototype._processNonTerminal = function(nonTerminal) {
    let availablePositions = this._getFreeNeighbours(nonTerminal.pos.x, nonTerminal.pos.y);
    availablePositions.push(nonTerminal.pos);
    let availableProductions = this._getAvailableProductions(nonTerminal, availablePositions);
    let production = this._pickProduction(availableProductions);
    console.log(nonTerminal.name, " --> ", production.nonTerminals);
    let newlyCreated = [];
    for(let t of production.nonTerminals) {
        let pos = availablePositions.pop();
        let newT = { name: t, pos: pos, references: {} };
        this.squares[pos.y][pos.x] = newT;
        if(this._isNonTerminal(newT))
            this.nonTerminals.push(newT);
        if(!this._isNonTerminal(newT) || newT.name == nonTerminal.name)
            newT.references = nonTerminal.references || {};
        this._updateEdges(pos, nonTerminal.pos);
        newlyCreated.push(newT);
    }
    if(!production.references) return;
    for(let r of production.references) {
        newlyCreated[r.from].references[r.name] = { name: newlyCreated[r.to].name, pos: newlyCreated[r.to].pos };
        newlyCreated[r.to].references[r.name] = { name: newlyCreated[r.from].name, pos: newlyCreated[r.from].pos };
    }
}

MapSchemaCreator.prototype._isNonTerminal = function(t) {
    return t.name[0] == t.name[0].toUpperCase();
}

MapSchemaCreator.prototype._getAvailableProductions = function(nonTerminal, availablePositions) {
    return this._productions[nonTerminal.name].filter((production) => {
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
