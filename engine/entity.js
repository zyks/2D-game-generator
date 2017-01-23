var EntityComponents = require('./entityComponents');
var uuid = require('uuid');

var Entity = function(components=[], name='') {
    this.id = uuid();
    this.name = name;
    this.components = new EntityComponents(components);
};

module.exports = Entity;
