var PlayerShootingSystem = function(engine, entityCreator) {
    this._engine = engine;
    this._entityCreator = entityCreator;
    this._elapsedTime = 0;
}

PlayerShootingSystem.prototype.start = function() {

}

PlayerShootingSystem.prototype.update = function(deltaTime) {
    this._elapsedTime += deltaTime;
    let players = this._engine.entities.getByGroup('players');
    for (let player of players) {
        let info = player.components.get("PlayerInfo");
        if(info.pressed.SHOOT && this._elapsedTime - info.lastShoot >= info.shootingInterval)
            this._shoot(player);
    }
}

PlayerShootingSystem.prototype.end = function() {

}

PlayerShootingSystem.prototype._shoot = function(player) {
    let info = player.components.get("PlayerInfo");
    let position = player.components.get("Position");
    info.lastShoot = this._elapsedTime;
    let x = info.mousePosition.x - position.x;
    let y = info.mousePosition.y - position.y;
    let length = Math.sqrt(x*x + y*y);
    let speed = 300;
    let xVel = x / length * speed;
    let yVel = y / length * speed;
    let bullet = this._entityCreator.createBullet(player, position.x, position.y, xVel, yVel);
    this._engine.entities.add(bullet);
}


module.exports = PlayerShootingSystem;
