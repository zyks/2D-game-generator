var io = require('socket.io-client');
var Engine = require('./engine/engine');
var Circle = require('./engine/gfx/circle');
var Rect = require('./engine/gfx/rect');
var ImagePrimitive = require('./engine/gfx/image');
var PrimitivesGroup = require('./engine/gfx/primitivesGroup');
var SpritesRepository = require('./engine/SpritesRepository');
var Entity = require('./engine/Entity');
var TileMapRenderSystem = require('./systems/TileMapRenderSystem');

var Client = function() {
    this._socket = io();
    this._engine = new Engine();
    this._canvas = document.getElementById("gameCanvas");
    this._ctx = this._canvas.getContext("2d");
}

Client.prototype._initSprites = function() {
    this._sprites = new SpritesRepository();
    this._sprites.add("atlas", "/assets/atlas.png");
    this._sprites.onCompleted((() => {
        this._addSystems();
        this._handleSocketEvents();
    }).bind(this));
}

Client.prototype.configure = function() {
    this._mapBrowserEvents();
    this._registerComponentsGroups();
    this._initSprites();
}

Client.prototype.run = function() {

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
    this._socket.on('gameState', (function(gameStateString) {
        let gameState = JSON.parse(gameStateString);
        this._engine.entities.clear();
        // TODO: Send sanitized form of data because we need to get components
        //       list (not dictionary). Now we get it thourgh private property.
        //       It's ugly as hell.
        for(let p of gameState.players)
          this._engine.entities.add(new Entity([p.components._componentByName['PlayerInfo']]));
        for(let l of gameState.mapLayers)
          this._engine.entities.add(new Entity([l.components._componentByName['TileMap']]));
        this._engine.update(0);
    }).bind(this));
}

Client.prototype._registerComponentsGroups = function() {
    this._engine.entities.registerGroup('players', ['PlayerInfo']);
    this._engine.entities.registerGroup('mapLayers', ['TileMap']);
}

Client.prototype._addSystems = function() {
    this._engine.addSystem(
      new TileMapRenderSystem(this._engine, this._ctx, this._sprites.get("atlas"))
    , 0);
}


window.onload = () => {
    var client = new Client();
    client.configure();
    client.run();
}
