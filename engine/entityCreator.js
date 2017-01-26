var Entity = require('./entity');
var PlayerInfo = require('../components/playerInfo');
var TileMap = require('../components/tileMap');
var Position = require('../components/position');
var Motion = require('../components/motion');
var TileMapGenerator = require('../TileMapGenerator');

var EntityCreator = function() {}

EntityCreator.prototype.createPlayer = function(name, socket) {
    var playerInfo = new PlayerInfo(name, socket);
    var position = new Position(100, 100);
    var motion = new Motion(0, 0, 50);
    var player = new Entity([playerInfo, position, motion], 'player');
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

module.exports = EntityCreator;
