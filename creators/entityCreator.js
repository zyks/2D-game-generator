var Entity = require('./../engine/entity');
var PlayerInfo = require('../components/playerInfo');
var EnemyInfo = require('../components/enemyInfo');
var TileMap = require('../components/tileMap');
var Position = require('../components/position');
var Graphics = require('../components/graphics');
var Motion = require('../components/motion');
var Geometry = require('../components/geometry');
var Bullet = require('../components/bullet');
var Character = require('../components/character');
var DoorInfo = require('../components/doorInfo');
var ItemInfo = require('../components/itemInfo');
var ItemList = require('../components/itemList');
var ChestInfo = require('../components/chestInfo');
var TileMapGenerator = require('../TileMapGenerator');
var MapSchemaCreator = require('./map/MapSchemaCreator');
var MapFromSchemaCreator = require('./map/MapFromSchemaCreator');
var CellularAutomataMap = require('./map/CellularAutomataMap');
var Config = require('../config');

var EntityCreator = function() {
    this._componentFactory = this._createComponentFactory();
}

EntityCreator.prototype.createPlayer = function(name, socket) {
    let info = new PlayerInfo(name, socket);
    let graphics  = new Graphics("player");
    let position = new Position(350, 350);
    let motion = new Motion(0, 0, 150);
    let geometry = new Geometry.Square(Config.TILE_SIZE);
    let itemList = new ItemList();
    let character = new Character(1000);
    let player = new Entity(
        [info, graphics, position, motion, geometry, itemList, character], 
        'player'
    );
    return player;
}

EntityCreator.prototype.createEnemy = function(x, y) {
    let position = new Position(x, y);
    let motion = new Motion(0, 0, 100);
    let graphics = new Graphics("zombie");
    let enemyInfo = new EnemyInfo();
    let geometry = new Geometry.Square(Config.TILE_SIZE);
    let character = new Character(2);
    let itemList = new ItemList();
    return new Entity([position, motion, graphics, enemyInfo, geometry, character]);
}


EntityCreator.prototype.createMap = function() {
    console.log(MapSchemaCreator);
    var schema = new MapSchemaCreator().create(6, 6, 0, 0);
    var tileMap = new MapFromSchemaCreator(schema).create();
    tileMap.tiles = new CellularAutomataMap().run(tileMap.tiles, Math.floor(Math.random()*3));
    var map = new Entity([tileMap], 'map');
    return map;
};

EntityCreator.prototype.createCamera = function(x, y) {
    var position = new Position(x, y);
    var camera = new Entity([position], "camera");
    return camera;
};

EntityCreator.prototype.createBullet = function(player, x, y, xVelocity, yVelocity) {
    let position = new Position(x, y);
    let motion = new Motion(xVelocity, yVelocity);
    let graphics = new Graphics("bullet");
    let bullet = new Bullet(player.id);
    let geometry = new Geometry.Circle(12);
    return new Entity([position, motion, graphics, bullet, geometry]);
}

EntityCreator.prototype.createDoor = function(x, y, keyId=null) {
    let info = new DoorInfo(keyId);
    let position = new Position(x, y);
    let graphics = new Graphics("doorClosed");
    let geometry = new Geometry.Square(Config.TILE_SIZE);
    return new Entity([info, position, graphics, geometry]);
}

EntityCreator.prototype.createKey = function() {
    let info = new ItemInfo("key");
    return new Entity([info]);
}

EntityCreator.prototype.createChest = function(x, y, items=[]) {
    let info = new ChestInfo();
    let position = new Position(x, y);
    let graphics = new Graphics("chest");
    let geometry = new Geometry.Square(Config.TILE_SIZE);
    let itemList = new ItemList(items);
    return new Entity([info, position, graphics, geometry, itemList]);
}

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
            "EnemyInfo": () => { return new EnemyInfo(); },
            "TileMap": () => { return new TileMap(); },
            "Graphics": () => { return new Graphics(); },
            "Position": () => { return new Position(); },
            "Motion": () => { return new Motion(); },
            "Geometry": () => { return {}; },
            "Bullet": () => { return new Bullet(); },
            "Character": () => { return new Character(); },
            "DoorInfo": () => { return new DoorInfo(); },
            "ItemInfo": () => { return new ItemInfo(); },
            "ItemList": () => { return new ItemList(); },
            "ChestInfo": () => { return new ChestInfo(); }
        }
    }

    ComponentFactory.prototype.create = function (name) {
        return this._workers[name]();
    };

    return new ComponentFactory();
}

module.exports = EntityCreator;
