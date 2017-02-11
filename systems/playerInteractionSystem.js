var Config = require('../config');


var PlayerInteractionSystem = function(engine) {
    this._engine = engine;
    this._minDistance = 90;
}

PlayerInteractionSystem.prototype.start = function() {

}

PlayerInteractionSystem.prototype.update = function(deltaTime) {
    let players = this._engine.entities.getByGroup("players");
    for (let player of players)
        if (player.components.get("PlayerInfo").pressed.ACTION) {
            this._checkDoorsInteraction(player);
            this._checkChestsInteraction(player);
        }
}

PlayerInteractionSystem.prototype.end = function() {

}

PlayerInteractionSystem.prototype._checkDoorsInteraction = function(player) {
    let doors = this._engine.entities.getByGroup("doors");
    for (let door of doors)
        if (this._actionCanBePerformed(player, door))
            this._performDoorAction(player, door);
}

PlayerInteractionSystem.prototype._checkChestsInteraction = function(player) {
    let chests = this._engine.entities.getByGroup("chests");
    for (let chest of chests)
        if (this._actionCanBePerformed(player, chest))
            this._performChestAction(player, chest);
}

PlayerInteractionSystem.prototype._actionCanBePerformed = function(player, entity) {
    let mPos = player.components.get("PlayerInfo").mousePosition;
    let pPos = player.components.get("Position");
    let tPos = entity.components.get("Position");
    let distance = Math.hypot(pPos.x - tPos.x, pPos.y - tPos.y);
    return this._isMouseOnTile(mPos, tPos) && distance < this._minDistance;
}

PlayerInteractionSystem.prototype._performDoorAction = function(player, door) {
    let keyId = door.components.get("DoorInfo").keyId;
    if (keyId && !this._playerHasKey(player, keyId)) {
        console.log(`Player ${player.id} doesn't have a key ${keyId}.`);
        return;
    }

    if (door.components.get("DoorInfo").closed)
        this._openDoor(door);
    else this._closeDoor(door);
}

PlayerInteractionSystem.prototype._performChestAction = function(player, chest) {
    let chestItemList = chest.components.get("ItemList");
    if (chestItemList.isEmpty()) {
        console.log(`Chest ${chest.id} is empty.`)
        return;
    }

    let playerItemList = player.components.get("ItemList");
    for (let itemId of chestItemList.items) {
        playerItemList.add(itemId);
        console.log(`Player ${player.id} obtained a new item.`)
    }
    chestItemList.clear();
}

PlayerInteractionSystem.prototype._isMouseOnTile = function(mouse, tileCenter) {
    let x = mouse.x - (mouse.x % Config.TILE_SIZE) + Config.TILE_SIZE / 2;
    let y = mouse.y - (mouse.y % Config.TILE_SIZE) + Config.TILE_SIZE / 2;
    return x === tileCenter.x && y === tileCenter.y;
}

PlayerInteractionSystem.prototype._playerHasKey = function(player, keyId) {
    return player.components.get("ItemList").containsItemWithId(keyId);
}

PlayerInteractionSystem.prototype._openDoor = function(door) {
    door.components.get("DoorInfo").closed = false;
    door.components.get("Graphics").primitive = "doorOpen";
}

PlayerInteractionSystem.prototype._closeDoor = function(door) {
    door.components.get("DoorInfo").closed = true;
    door.components.get("Graphics").primitive = "doorClosed";
}


module.exports = PlayerInteractionSystem;
