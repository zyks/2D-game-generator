var Config = require('../config');


var PlayerDoorInteractionSystem = function(engine) {
    this._engine = engine;
    this._minDistance = 90;
}

PlayerDoorInteractionSystem.prototype.start = function() {

}

PlayerDoorInteractionSystem.prototype.update = function(deltaTime) {
    let players = this._engine.entities.getByGroup("players");
    for (let player of players)
        if (player.components.get("PlayerInfo").pressed.ACTION)
            this._checkDoorsInteraction(player);
}

PlayerDoorInteractionSystem.prototype.end = function() {

}

PlayerDoorInteractionSystem.prototype._checkDoorsInteraction = function(player) {
    let doors = this._engine.entities.getByGroup("doors");
    for (let door of doors) {
        let mousePosition = player.components.get("PlayerInfo").mousePosition;
        let tilePosition = door.components.get("Position");
        let distance = this._getPlayerDoorDistance(player, door);
        if (this._isMouseOnTile(mousePosition, tilePosition) && distance < this._minDistance)
            this._performAction(player, door);
    }
}

PlayerDoorInteractionSystem.prototype._isMouseOnTile = function(mouse, tileCenter) {
    let x = mouse.x - (mouse.x % Config.TILE_SIZE) + Config.TILE_SIZE / 2;
    let y = mouse.y - (mouse.y % Config.TILE_SIZE) + Config.TILE_SIZE / 2;
    return x === tileCenter.x && y === tileCenter.y;
}

PlayerDoorInteractionSystem.prototype._performAction = function(player, door) {
    if (door.components.get("DoorInfo").closed)
        this._openDoor(door);
    else this._closeDoor(door);
}

PlayerDoorInteractionSystem.prototype._openDoor = function(door) {
    door.components.get("DoorInfo").closed = false;
    door.components.get("Graphics").primitive = "doorOpen";
}

PlayerDoorInteractionSystem.prototype._closeDoor = function(door) {
    door.components.get("DoorInfo").closed = true;
    door.components.get("Graphics").primitive = "doorClosed";
}

PlayerDoorInteractionSystem.prototype._getPlayerDoorDistance = function(player, door) {
    let p = player.components.get("Position");
    let d = door.components.get("Position");
    return Math.sqrt(Math.pow(p.x - d.x, 2) + Math.pow(p.y - d.y, 2));
}
module.exports = PlayerDoorInteractionSystem;

