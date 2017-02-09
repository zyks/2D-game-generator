var EnemyMotionSystem = function(engine) {
    this._engine = engine;
}

EnemyMotionSystem.prototype.start = function() {

}

EnemyMotionSystem.prototype.update = function(time) {
    let enemies = this._engine.entities.getByGroup('enemies');
    for (let enemy of enemies)
        this._updateMotion(enemy);
}

EnemyMotionSystem.prototype.end = function() {

}

EnemyMotionSystem.prototype._updateMotion = function(enemy) {
    let info = enemy.components.get("EnemyInfo");
    let position = enemy.components.get("Position");
    let motion = enemy.components.get("Motion");
    player = this._getClosestPlayerInSight(info, position);
    if(!player) return;
    playerPos = player.components.get("Position")
    let x = playerPos.x - position.x;
    let y = playerPos.y - position.y;
    let length = Math.sqrt(x*x + y*y);
    let speed = 100;
    let xVel = x / length * speed;
    let yVel = y / length * speed;
    motion.set(xVel, yVel);
}

EnemyMotionSystem.prototype._getClosestPlayerInSight = function(info, position) {
    players = this._engine.entities.getByGroup("players");
    let closest = null;
    let closestDist = info.sightRange;
    for(let p of players) {
        let pPos = p.components.get("Position");
        dist = Math.sqrt(Math.pow(position.x - pPos.x, 2) + Math.pow(position.y - pPos.y, 2));
        if(dist < closestDist) closest = p;
    }
    return closest;
}

module.exports = EnemyMotionSystem;
