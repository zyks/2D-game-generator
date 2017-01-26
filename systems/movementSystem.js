var MovementSystem = function(engine) {
    this._engine = engine;
}

MovementSystem.prototype.start = function() {

}

MovementSystem.prototype.update = function(time) {
    entities = this._engine.entities.getByGroup('movement');
    for (let entity of entities) {
        let motion = entity.components.get('Motion');
        let position = entity.components.get('Position');
        position.x += motion.x_velocity * (time / 1000);
        position.y += motion.y_velocity * (time / 1000);
        console.log(`Entity ${entity.id} position: ${position.x}, ${position.y}`);
    }
}

MovementSystem.prototype.end = function() {

}


module.exports = MovementSystem;
