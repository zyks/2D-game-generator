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
    for (let door of doors)
        if (this._actionShouldBePerformed(player, door))
            this._performAction(player, door);
}

PlayerDoorInteractionSystem.prototype._actionShouldBePerformed = function(player, door) {
    let mPos = player.components.get("PlayerInfo").mousePosition;
    let pPos = player.components.get("Position");
    let tPos = door.components.get("Position");
    let keyId = door.components.get("DoorInfo").keyId;
    let distance = Math.hypot(pPos.x - tPos.x, pPos.y - tPos.y);
    return this._isMouseOnTile(mPos, tPos) &&
           distance < this._minDistance &&
           this._playerHasKey(player, keyId);
}

PlayerDoorInteractionSystem.prototype._isMouseOnTile = function(mouse, tileCenter) {
    let x = mouse.x - (mouse.x % Config.TILE_SIZE) + Config.TILE_SIZE / 2;
    let y = mouse.y - (mouse.y % Config.TILE_SIZE) + Config.TILE_SIZE / 2;
    return x === tileCenter.x && y === tileCenter.y;
}

PlayerDoorInteractionSystem.prototype._playerHasKey = function(player, keyId) {
    if (!keyId) return true;
    let result = player.components.get("ItemList").containsItemWithId(keyId);
    if (!result) console.log(`Player ${player.id} doesn't have a key ${keyId}`);
    return result;
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


module.exports = PlayerDoorInteractionSystem;
