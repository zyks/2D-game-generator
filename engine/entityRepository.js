var EntityRepository = function() {
    this._componentsNamesByGroup = {};
    this._entitiesByGroup = {};
}

EntityRepository.prototype.add = function(entity) {
    for (name in self._componentsNamesByGroup)
        if (this._entityMatchesGroup(entity, name))
            this._entitiesByGroup[name].push(entity);
}

EntityRepository.prototype.remove = function(entity) {
    for (name in this._entitiesByGroup) {
        if (entity in this._entitiesByGroup[name]) {
            var i = this._entitiesByGroup.indexOf(entity);
            this._entitiesByGroup.splice(i, 1);
        }
    }
}

EntityRepository.prototype.clear = function() {
    for (name in this._entitiesByGroup)
        delete this._entitiesByGroup[name];
}

EntityRepository.prototype.getByGroup = function(name) {
    if (name in this._componentsNamesByGroup)
        return this._entitiesByGroup[name];
}

EntityRepository.prototype.registerGroup = function(name, componentsNames) {
    if (!(name in this._componentsNamesByGroup)) {
        this._componentsNamesByGroup[name] = componentsNames;
        this._entitiesByGroup[name] = [];
    }
}

EntityRepository.prototype.unregisterGroup = function(name) {
    if (name in this._componentsNamesByGroup) {
        delete this._componentsNamesByGroup[name];
        delete this._entitiesByGroup[name];
    }
}

EntityRepository.prototype._entityMatchesGroup = function(entity, groupName) {
    var hits = 0;
    for (component of entity.components.all())
        if (component.name in this._componentsNamesByGroup)
            hits++;
    return hits == this._componentsNamesByGroup[groupName].length
}


module.exports = EntityRepository;
