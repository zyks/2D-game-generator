var EntityComponents = function(components=[]) {
    this.components = {};
    for (component of components)
        this.add(component);
}

EntityComponents.prototype.add = function(component) {
    if (!(component.name in this.components))
        this.components[component.name] = component;
}

EntityComponents.prototype.remove = function(component) {
    if (component.name in this.components) 
        delete this.components[component.name];
}

EntityComponents.prototype.get = function(name) {
    if (name in this.components)
        return this.components[name];
}


module.exports = EntityComponents;
