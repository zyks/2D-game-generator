var io = require('socket.io-client');
var Engine = require('./engine/engine');
var Circle = require('./engine/gfx/circle');
var Rect = require('./engine/gfx/rect');
var ImagePrimitive = require('./engine/gfx/image');
var PrimitivesGroup = require('./engine/gfx/primitivesGroup');
var SpritesRepository = require('./engine/SpritesRepository');
var Entity = require('./engine/Entity');
var TileMapRenderSystem = require('./systems/TileMapRenderSystem');
var EntityCreator = require('./engine/EntityCreator');
var PlayerInfo = require('./components/PlayerInfo');
var TileMap = require('./components/TileMap');

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
            cameraPosition.y -= 4;
            this._socket.emit('keyPressed', { key: 'W' });
        } else if (event.keyCode == 83) {
            cameraPosition.y += 4;
            this._socket.emit('keyPressed', { key: 'S' });
        } else if (event.keyCode == 65) {
            cameraPosition.x -= 4;
            this._socket.emit('keyPressed', { key: 'A' });
        } else if (event.keyCode == 68) {
            cameraPosition.x += 4;
            this._socket.emit('keyPressed', { key: 'D' });
        }
    }).bind(this);
}

Client.prototype._handleSocketEvents = function() {
    this._socket.on('registered', function(data) {
        console.log(`I have been registered with name ${data.nickname}`);
    });
    this._socket.on('gameState', (function(gameStateString) {
        let gameState = JSON.parse(gameStateString);
        camera = this._engine.entities.getByName("camera");
        this._engine.entities.clear();
        this._engine.entities.add(camera);
        for(let p of gameState.players)
          this._engine.entities.add(new Entity(this._recreateComponents(p.components, p.name)));
        for(let l of gameState.mapLayers)
          this._engine.entities.add(new Entity(this._recreateComponents(l.components, l.name)));
        this._engine.update(0);
    }).bind(this));
}

Client.prototype._recreateComponents = function(componentBlueprints) {
    var ComponentFactory = function() {
        this._workers = {
            "PlayerInfo": () => { return new PlayerInfo(); },
            "TileMap": () => { return new TileMap(); }
        }
    }

    ComponentFactory.prototype.create = function (name) {
        return this._workers[name]();
    };
    let componentFactory = new ComponentFactory();
    let recreate = (componentBlueprint) => {
      let component = componentFactory.create(componentBlueprint.name);
      for (let property in componentBlueprint) {
          component[property] = componentBlueprint[property];
      }
      return component;
    }
    return componentBlueprints.map(recreate);
};

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
