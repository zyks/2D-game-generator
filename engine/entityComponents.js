var EntityComponents = function(components=[]) {
    this._componentsByName = {};
    for (component of components)
        this.add(component);
}

EntityComponents.prototype.add = function(component) {
    if (!(component.name in this._componentsByName))
        this._componentsByName[component.name] = component;
}

EntityComponents.prototype.remove = function(component) {
    if (component.name in this._componentsByName) 
        delete this._componentsByName[component.name];
}

EntityComponents.prototype.get = function(name) {
    if (name in this._componentsByName)
        return this._componentsByName[name];
}

EntityComponents.prototype.all = function() {
    var components = [];
    for (name in self._componentsByName)
        components.concat(this._componentsByName[name]);
    return components;
}


module.exports = EntityComponents;
