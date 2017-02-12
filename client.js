var io = require('socket.io-client');
var Engine = require('./engine/engine');
var SpritesRepository = require('./engine/SpritesRepository');
var Entity = require('./engine/Entity');
var TileMapRenderSystem = require('./systems/TileMapRenderSystem');
var MiniMapRenderSystem = require('./systems/MiniMapRenderSystem');
var GraphicEntityRenderSystem = require('./systems/GraphicEntityRenderSystem');
var HandleKeyboardSystem = require('./systems/HandleKeyboardSystem');
var HandleMouseSystem = require('./systems/HandleMouseSystem');
var EntityCreator = require('./creators/EntityCreator');
var Config = require('./Config');
var KeyCodes = require('./KeyCodes');

var Client = function() {
    this._socket = io();
    this._engine = new Engine();
    this._canvas = document.getElementById("gameCanvas");
    this._ctx = this._canvas.getContext("2d");
    this._hudCtx = document.getElementById("hudCanvas").getContext("2d");
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
    this._registerComponentsGroups();
    this._initSprites();
    this._entityCreator = new EntityCreator();
    this._engine.entities.add(this._entityCreator.createCamera(400, 400));
}

Client.prototype.run = function() {

}

Client.prototype._handleSocketEvents = function() {
    this._socket.on('registered', function(data) {
        this._playerId = data.playerId;
        console.log(`I have been registered with name ${data.nickname}`);
    }.bind(this));
    this._socket.on('gameState', (function(gameStateString) {
        let gameState = JSON.parse(gameStateString);
        this._engine.entities.clearGroup("enemies");
        this._engine.entities.clearGroup("bullets");
        this._recreateEntities(gameState.players);
        this._recreateEntities(gameState.mapLayers);
        this._recreateEntities(gameState.bullets);
        this._recreateEntities(gameState.enemies);
        this._engine.update(30);
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
    this._engine.entities.registerGroup('enemies', ['EnemyInfo']);
    this._engine.entities.registerGroup('mapLayers', ['TileMap']);
    this._engine.entities.registerGroup('graphicsEntities', ['Graphics', 'Position']);
    this._engine.entities.registerGroup('enemies', ['EnemyInfo']);
    this._engine.entities.registerGroup('bullets', ['Bullet']);
}

Client.prototype._addSystems = function() {
    let actions = [
        { key: KeyCodes.W, name: "MOVE_UP" },
        { key: KeyCodes.S, name: "MOVE_DOWN" },
        { key: KeyCodes.A, name: "MOVE_LEFT" },
        { key: KeyCodes.D, name: "MOVE_RIGHT" },
        { key: KeyCodes.SHIFT, name: "SHOOT" }
    ]
    this._engine.addSystem(
      new TileMapRenderSystem(this._engine, this._ctx, this._sprites.get("atlas"))
    , 0);
    this._engine.addSystem(
      new GraphicEntityRenderSystem(this._engine, this._ctx)
    , 1);
    this._engine.addSystem(
      new MiniMapRenderSystem(this._engine, this._hudCtx, this._sprites.get("atlas"))
    , 1.5);
    this._engine.addSystem(
      new HandleKeyboardSystem(this._engine, this._socket, actions)
    , 2);
    this._engine.addSystem(
      new HandleMouseSystem(this._engine, this._socket, this._canvas, 33)
    , 3);
}


window.onload = () => {
    var client = new Client();
    client.configure();
    client.run();
}
