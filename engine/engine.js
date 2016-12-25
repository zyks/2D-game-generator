var EntityRepository = require('./entityRepository');


var Engine = function() {
    this.entities = new EntityRepository();
    this._systems = [];
}

Engine.prototype.addSystem = function(system, priority) {
    var index = 0;
    for (s of this._systems)
        if (s.priority < priority)
            index++;
    system.priority = priority;
    this._systems.splice(index, 0, system);
    system.start();
}

Engine.prototype.removeSystem = function(system) {
    system.end();
    for (var i = 0; i < this._systems.length; i++)
        if (this._systems[i] == system)
            this._systems.splice(i, 0);
}

Engine.prototype.update = function(time) {
    for (system of this._systems)
        system.update(time);
}


module.exports = Engine;
