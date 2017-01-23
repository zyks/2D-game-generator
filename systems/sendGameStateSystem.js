var SendGameStateSystem = function(engine) {
    this._engine = engine;
    this._elapsedTime = 0;
    this._sendingInterval = 100;
}

SendGameStateSystem.prototype.start = function() {

}

SendGameStateSystem.prototype.update = function(time) {
    this._elapsedTime += time;

    if (this._elapsedTime < this._sendingInterval)
        return;

    this._elapsedTime -= this._sendingInterval;
    let gameState = this._getGameState();
    let gameStateString = this._serialize(gameState);
    let players = this._engine.entities.getByGroup('players');

    for (let player of players) {
        let playerInfo = player.components.get('PlayerInfo');
        playerInfo.socket.emit('gameState', gameStateString);
    }
}

SendGameStateSystem.prototype.end = function() {

}

SendGameStateSystem.prototype._getGameState = function() {
    let sanitizeEntity = (entity) => {
      return {
        name: entity.name,
        components: entity.components.all()
      }
    }
    let gameState = {
        players: this._engine.entities.getByGroup('players').map(sanitizeEntity),
        mapLayers: this._engine.entities.getByGroup('mapLayers').map(sanitizeEntity)
    }
    return gameState;
}

SendGameStateSystem.prototype._serialize = function(data) {
    let serializedData = JSON.stringify(data, (key, value) => {
        if(key !== 'socket')
            return value;
    });
    return serializedData;
}


module.exports = SendGameStateSystem;
