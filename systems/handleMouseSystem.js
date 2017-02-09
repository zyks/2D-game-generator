var Viewport = require('./../helpers/Viewport');

var HandleMouseSystem = function(engine, socket, canvas, sendingInterval = 30) {
    this._engine = engine;
    this._socket = socket;
    this._canvas = canvas;
    this._sendingInterval = sendingInterval;
    this._elapsedTime = 0;
    this._lastMousePosition = { x: 0, y: 0 };
}

HandleMouseSystem.prototype.start = function() {
    document.addEventListener("mousemove", (event) => {
        this._lastMousePosition = { x: event.clientX, y: event.clientY };
    }, false);
}

HandleMouseSystem.prototype.update = function(deltaTime) {
    this._elapsedTime += deltaTime;
    if(this._elapsedTime > this._sendingInterval) {
        this._elapsedTime -= this._sendingInterval;
        let position = this._calcRelativePosition(this._lastMousePosition);
        this._socket.emit('mouseMove', position);
    }
}

HandleMouseSystem.prototype.end = function() {
    // TODO: remove action listener
}

HandleMouseSystem.prototype._calcRelativePosition = function(position) {
    let camera = this._engine.entities.getByName("camera");
    let layer = this._engine.entities.getByGroup("mapLayers")[0].components.get("TileMap");
    let viewport = new Viewport(layer, camera).coordinates();
    let canvasBox = this._canvas.getBoundingClientRect();
    let relativeX = position.x - canvasBox.left + viewport.x;
    let relativeY = position.y - canvasBox.top + viewport.y;
    return { x: relativeX, y: relativeY };
}

module.exports = HandleMouseSystem;
