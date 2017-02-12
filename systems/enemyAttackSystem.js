var Geometry = require('../components/geometry');
var Config = require('../config');


var EnemyAttackSystem = function(engine) {
    this._engine = engine;
    this._elapsedTime = 0;
}

EnemyAttackSystem.prototype.start = function() {

}

EnemyAttackSystem.prototype.update = function(deltaTime) {
    this._elapsedTime += deltaTime;
    let enemies = this._engine.entities.getByGroup('enemies');
    let players = this._engine.entities.getByGroup('players');
    for (let enemy of enemies)
        for (let player of players)
            this._checkCollision(enemy, player)
}

EnemyAttackSystem.prototype.end = function() {

}

EnemyAttackSystem.prototype._checkCollision = function(enemy, player) {
    let enemyGeometry = this._getEntityGeometry(enemy);
    let playerGeometry = this._getEntityGeometry(player);
    let info = enemy.components.get("EnemyInfo");
    let timeFromLastAttack = this._elapsedTime - info.lastAttack;

    let response = playerGeometry.checkIntersection(enemyGeometry);
    if (response.result && timeFromLastAttack > info.attackingInterval) {
        this._damageEntity(player, info.damage);
        info.lastAttack = this._elapsedTime;
    }
}

EnemyAttackSystem.prototype._damageEntity = function(entity, damage) {
    let character = entity.components.get("Character");
    character.hp -= damage;
    console.log("HP: ", character.hp);
}

EnemyAttackSystem.prototype._getEntityGeometry = function(entity) {
    let entityCenter = entity.components.get("Position");
    let entityGeometry = entity.components.get("Geometry");
    let shiftX = 0, shiftY = 0;
    if (entityGeometry instanceof Geometry.Square)
        shiftX = -0.5 * Config.TILE_SIZE, shiftY = 0.5 * Config.TILE_SIZE;
    entityGeometry.setPosition(entityCenter.x + shiftX, (-1) * (entityCenter.y + shiftY));
    return entityGeometry;
}


module.exports = EnemyAttackSystem;
