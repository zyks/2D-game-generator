var io = require('socket.io-client');
var Circle = require('./engine/gfx/circle');
var Rect = require('./engine/gfx/rect');
var ImagePrimitive = require('./engine/gfx/image');
var PrimitivesGroup = require('./engine/gfx/primitivesGroup');


var Client = function() {
    this._socket = io()
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

window.onload = () => {
  var client = new Client()
  client.renderTest();
}
