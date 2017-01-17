var io = require('socket.io-client');
var Engine = require('./engine/engine');
var Circle = require('./engine/gfx/circle');
var Rect = require('./engine/gfx/rect');
var ImagePrimitive = require('./engine/gfx/image');
var PrimitivesGroup = require('./engine/gfx/primitivesGroup');


var Client = function() {
    this._socket = io();
    this._engine = new Engine();
    this._canvas = document.getElementById("gameCanvas");
    this._ctx = this._canvas.getContext("2d");
}

Client.prototype.renderTest = function() {
    this._bg = new Image()
    this._bg.onload = () => {
        this._ready = true;
        let bg = new ImagePrimitive(0, 0, this._bg);
        bg.render(this._ctx, 120, 30);
    }
    this._bg.src = "/assets/atlas.png";
    let eye = [
        new Circle(0, 0, 10).fill("white").stroke("black"),
        new Circle(0, 0, 3).fill("blue"),
    ]
    let eyes = new PrimitivesGroup(0, -10, [
        new PrimitivesGroup(-15, 0, eye),
        new PrimitivesGroup(15, 0, eye)
    ]);
    let head = new PrimitivesGroup(0, 0, [
        new Rect(-30, -30, 60, 60).fill("yellow").stroke("grey", 3),
        eyes,
        new Rect(-10, 10, 20, 8).fill("red")
    ]);
    head.render(this._ctx, 60, 60);
}

Client.prototype.configure = function() {
    this._mapBrowserEvents();
    this._handleSocketEvents();
    this._registerComponentsGroups();
    this._addSystems();
}

Client.prototype.run = function() {
    this.renderTest();
}

Client.prototype._mapBrowserEvents = function() {
    document.onkeydown = (function(event) {
        if (event.keyCode == 87)
            this._socket.emit('keyPressed', { key: 'W' });
        else if (event.keyCode == 83)
            this._socket.emit('keyPressed', { key: 'S' });
        else if (event.keyCode == 65)
            this._socket.emit('keyPressed', { key: 'A' });
        else if (event.keyCode == 68)
            this._socket.emit('keyPressed', { key: 'D' });
    }).bind(this);
}

Client.prototype._handleSocketEvents = function() {
    this._socket.on('registered', function(data) {
        console.log(`I have been registered with name ${data.nickname}`);
    });
}

Client.prototype._registerComponentsGroups = function() {

}

Client.prototype._addSystems = function() {

}


window.onload = () => {
    var client = new Client();
    client.configure();
    client.run();
}
