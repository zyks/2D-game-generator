var EntityComponents = require('./entityComponents');


var Entity = function(components=[], name='') {
    this.id = idGenerator.next().value;
    this.name = name;
    this.components = new EntityComponents(components);
};


function* idGenerator() {
    var id = 1;
    while (true)
        yield id++;
}
var idGenerator = idGenerator();


module.exports = Entity;
