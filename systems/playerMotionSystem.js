var PlayerMotionSystem = function(engine) {
    this._engine = engine;
}

PlayerMotionSystem.prototype.start = function() {

}

PlayerMotionSystem.prototype.update = function(time) {
    let players = this._engine.entities.getByGroup('players');
    for (let player of players) {
        let pressedKeysMap = player.components.get("PlayerInfo").pressed;
        let motion = player.components.get("Motion");
        this._updateMotion(pressedKeysMap, motion);
    }
}

PlayerMotionSystem.prototype.end = function() {

}

PlayerMotionSystem.prototype._updateMotion = function(pressed, motion) {
    let max = motion.maxVelocity;
    motion.yVelocity = pressed.MOVE_DOWN * max || pressed.MOVE_UP * (-1) * max;
    motion.xVelocity = pressed.MOVE_RIGHT * max || pressed.MOVE_LEFT * (-1) * max;
}


module.exports = PlayerMotionSystem;
