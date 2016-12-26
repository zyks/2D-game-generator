var EntityRepository = function() {
    this._componentsNamesByGroup = {};
    this._entitiesByGroup = {};
}

EntityRepository.prototype.add = function(entity) {
    for (let name in this._componentsNamesByGroup)
        if (this._entityMatchesGroup(entity, name))
            this._entitiesByGroup[name].push(entity);
}

EntityRepository.prototype.remove = function(entity) {
    for (let name in this._entitiesByGroup) {
        let i = this._entitiesByGroup[name].indexOf(entity);
        if (i >= 0)
            this._entitiesByGroup[name].splice(i, 1);
    }
}

EntityRepository.prototype.clear = function() {
    for (let name in this._entitiesByGroup)
        delete this._entitiesByGroup[name];
}

EntityRepository.prototype.getByGroup = function(name) {
    if (name in this._componentsNamesByGroup)
        return this._entitiesByGroup[name];
    return [];
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
    let hits = 0;
    for (let component of entity.components.all())
        if (this._componentsNamesByGroup[groupName].indexOf(component.name) >= 0)
            hits++;
    return hits == this._componentsNamesByGroup[groupName].length
}


module.exports = EntityRepository;
