var io = require('socket.io-client');
var Engine = require('./engine/engine');
var SpritesRepository = require('./engine/SpritesRepository');
var Entity = require('./engine/Entity');
var TileMapRenderSystem = require('./systems/TileMapRenderSystem');
var GraphicEntityRenderSystem = require('./systems/GraphicEntityRenderSystem');
var PrimitiveCreator = require('./creators/primitiveCreator');
var EntityCreator = require('./creators/EntityCreator');

var Client = function() {
    this._socket = io();
    this._engine = new Engine();
    this._canvas = document.getElementById("gameCanvas");
    this._ctx = this._canvas.getContext("2d");
    this._primitiveCreator = new PrimitiveCreator();
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
    this._entityCreator = new EntityCreator();
    this._engine.entities.add(this._entityCreator.createCamera(400, 400));
}

Client.prototype.run = function() {

}

Client.prototype._mapBrowserEvents = function() {
    document.onkeydown = (function(event) {
        camera = this._engine.entities.getByName("camera");
        cameraPosition = camera.components.get("Position");
        if (event.keyCode == 87) {
            this._socket.emit('keyDown', { key: 'W' });
        } else if (event.keyCode == 83) {
            this._socket.emit('keyDown', { key: 'S' });
        } else if (event.keyCode == 65) {
            this._socket.emit('keyDown', { key: 'A' });
        } else if (event.keyCode == 68) {
            this._socket.emit('keyDown', { key: 'D' });
        }
    }).bind(this);
    document.onkeyup = (function(event) {
        if (event.keyCode == 87) {
            this._socket.emit('keyUp', { key: 'W' });
        } else if (event.keyCode == 83) {
            this._socket.emit('keyUp', { key: 'S' });
        } else if (event.keyCode == 65) {
            this._socket.emit('keyUp', { key: 'A' });
        } else if (event.keyCode == 68) {
            this._socket.emit('keyUp', { key: 'D' });
        }
    }).bind(this);
}

Client.prototype._handleSocketEvents = function() {
    this._socket.on('registered', function(data) {
        this._playerId = data.playerId;
        console.log(`I have been registered with name ${data.nickname}`);
    }.bind(this));
    this._socket.on('gameState', (function(gameStateString) {
        let gameState = JSON.parse(gameStateString);
        this._recreateEntities(gameState.players);
        this._recreateEntities(gameState.mapLayers);
        this._engine.update(0);
    }).bind(this));
}

Client.prototype._recreateEntities = function(entities) {
    for(let e of entities) {
        // TODO: We should remove also entities which were removed on server
        //       but are still on client side
        let localEntity = this._engine.entities.getById(e.id);
        if(localEntity != null)
            this._engine.entities.remove(localEntity);
        this._engine.entities.add(this._entityCreator.recreate(e));
    }
    // TODO: Remove it. It's only temporary camera centering
    camera = this._engine.entities.getByName("camera");
    playerPos = this._engine.entities.getById(this._playerId).components.get("Position");
    camera.components.get("Position").set(playerPos.x, playerPos.y);
}

Client.prototype._registerComponentsGroups = function() {
    this._engine.entities.registerGroup('players', ['PlayerInfo']);
    this._engine.entities.registerGroup('mapLayers', ['TileMap']);
    this._engine.entities.registerGroup('graphicsEntities', ['Graphics', 'Position'])
}

Client.prototype._addSystems = function() {
    this._engine.addSystem(
      new TileMapRenderSystem(this._engine, this._ctx, this._sprites.get("atlas"))
    , 0);
    this._engine.addSystem(
      new GraphicEntityRenderSystem(this._engine, this._ctx, this._primitiveCreator)
    , 1);
}


window.onload = () => {
    var client = new Client();
    client.configure();
    client.run();
}
