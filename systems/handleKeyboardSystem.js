var HandleKeyboardSystem = function(engine, socket, actions) {
    this._engine = engine;
    this._socket = socket;
    this._actions = actions;
}

HandleKeyboardSystem.prototype.start = function() {
    document.onkeydown = (event) => {
        for(let action of this._actions)
            if(action.key == event.keyCode)
                this._socket.emit('keyDown', { action: action.name });
    }
    document.onkeyup = (event) => {
        for(let action of this._actions)
            if(action.key == event.keyCode)
                this._socket.emit('keyUp', { action: action.name });
    }
}

HandleKeyboardSystem.prototype.update = function(deltaTime) {

}

HandleKeyboardSystem.prototype.end = function() {
    // TODO: remove watches on key actions
}


module.exports = HandleKeyboardSystem;
