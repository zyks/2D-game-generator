var Entity = require('./../engine/entity');
var PlayerInfo = require('../components/playerInfo');
var TileMap = require('../components/tileMap');
var Position = require('../components/position');
var Graphics = require('../components/graphics');
var Motion = require('../components/motion');
var TileMapGenerator = require('../TileMapGenerator');

var EntityCreator = function() {
    this._componentFactory = this._createComponentFactory();
}

EntityCreator.prototype.createPlayer = function(name, socket) {
    let playerInfoComponent = new PlayerInfo(name, socket);
    let playerGraphicComponent = new Graphics("player");
    let playerPositionComponent = new Position(500, 500);
    var playerMotionComponent = new Motion(0, 0, 100);
    let player = new Entity([
      playerInfoComponent,
      playerGraphicComponent,
      playerPositionComponent,
      playerMotionComponent
    ], 'player');
    return player;
}


EntityCreator.prototype.createMap = function() {
    var tileMapGenerator = new TileMapGenerator();
    var tileMap = new TileMap(tileMapGenerator.generate(50, 50), 50, 50);
    var map = new Entity([tileMap], 'map');
    return map;
};

EntityCreator.prototype.createCamera = function(x, y) {
    var position = new Position(x, y);
    var camera = new Entity([position], "camera");
    return camera;
};

EntityCreator.prototype.recreate = function(entity) {
    return new Entity(this._recreateComponents(entity.components), entity.name, entity.id);
}

EntityCreator.prototype._recreateComponents = function(componentBlueprints) {
    let recreate = (componentBlueprint) => {
        let component = this._componentFactory.create(componentBlueprint.name);
        for (let property in componentBlueprint) {
            component[property] = componentBlueprint[property];
        }
        return component;
    }
    return componentBlueprints.map(recreate);
};

EntityCreator.prototype._createComponentFactory = function() {
    let ComponentFactory = function() {
        this._workers = {
            "PlayerInfo": () => { return new PlayerInfo(); },
            "TileMap": () => { return new TileMap(); },
            "Graphics": () => { return new Graphics(); },
            "Position": () => { return new Position(); },
            "Motion": () => { return new Motion(); }
        }
    }

    ComponentFactory.prototype.create = function (name) {
        return this._workers[name]();
    };

    return new ComponentFactory();
}

module.exports = EntityCreator;
