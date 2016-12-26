var EntityComponents = function(components=[]) {
    this._componentByName = {};
    for (let component of components)
        this.add(component);
}

EntityComponents.prototype.add = function(component) {
    if (!(component.name in this._componentByName))
        this._componentByName[component.name] = component;
}

EntityComponents.prototype.remove = function(component) {
    if (component.name in this._componentByName) 
        delete this._componentByName[component.name];
}

EntityComponents.prototype.get = function(name) {
    if (name in this._componentByName)
        return this._componentByName[name];
}

EntityComponents.prototype.all = function() {
    var components = [];
    for (let name in this._componentByName)
        components.push(this._componentByName[name]);
    return components;
}


module.exports = EntityComponents;
