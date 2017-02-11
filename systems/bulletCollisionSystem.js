var Config = require('../config');


var BulletCollisionSystem = function(engine) {
    this._engine = engine;
}

BulletCollisionSystem.prototype.start = function() {

}

BulletCollisionSystem.prototype.update = function(time) {
    let bullets = this._engine.entities.getByGroup('bullets');
    let enemies = this._engine.entities.getByGroup('enemies');
    for (let bullet of bullets)
        for (let enemy of enemies)
            this._checkCollision(bullet, enemy)
}

BulletCollisionSystem.prototype.end = function() {

}

BulletCollisionSystem.prototype._checkCollision = function(bullet, enemy) {
    let enemySquare = this._getEnemySquare(enemy);
    let bulletCircle = this._getBulletCircle(bullet);
    
    let response = enemySquare.checkIntersection(bulletCircle);
    if (response.result) {
        this._damageEntity(enemy);
        this._engine.entities.remove(bullet);
    }
}

BulletCollisionSystem.prototype._damageEntity = function(entity) {
    let character = entity.components.get("Character");
    character.hp -= 1;
}

BulletCollisionSystem.prototype._getEnemySquare = function(enemy) {
    let enemyBottomLeft = {
        x: enemy.components.get("Position").x - Config.TILE_SIZE / 2,
        y: enemy.components.get("Position").y + Config.TILE_SIZE / 2
    }
    let enemySquare = enemy.components.get("Geometry");
    enemySquare.setPosition(enemyBottomLeft.x, (-1) * enemyBottomLeft.y);
    return enemySquare;
}

BulletCollisionSystem.prototype._getBulletCircle = function(bullet) {
    let bulletCenter = bullet.components.get("Position");
    let bulletCircle = bullet.components.get("Geometry");
    bulletCircle.setPosition(bulletCenter.x, (-1) * bulletCenter.y);
    return bulletCircle;
}


module.exports = BulletCollisionSystem;
