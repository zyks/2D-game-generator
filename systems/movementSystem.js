var MovementSystem = function(engine) {
    this._engine = engine;
}

MovementSystem.prototype.start = function() {

}

MovementSystem.prototype.update = function(time) {
    let entities = this._engine.entities.getByGroup('movement');
    for (let entity of entities) {
        let motion = entity.components.get('Motion');
        let position = entity.components.get('Position');
        let deltaX = motion.xVelocity * (time / 1000);
        let deltaY = motion.yVelocity * (time / 1000);
        position.move(deltaX, deltaY);
    }
}

MovementSystem.prototype.end = function() {

}


module.exports = MovementSystem;
