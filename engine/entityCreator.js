var Entity = require('./entity');
var PlayerInfo = require('../components/playerInfo');
var TileMap = require('../components/tileMap');
var Position = require('../components/position')
var TileMapGenerator = require('../TileMapGenerator');

var EntityCreator = function() {}

EntityCreator.prototype.createPlayer = function(name, socket) {
    var playerInfoComponent = new PlayerInfo(name, socket);
    var player = new Entity([playerInfoComponent], 'player');
    return player;
}


EntityCreator.prototype.createMap = function() {
  var tileMapGenerator = new TileMapGenerator();
  var tileMap = new TileMap(tileMapGenerator.generate(50, 50));
  var map = new Entity([tileMap], 'map');
  return map;
};

EntityCreator.prototype.createCamera = function(x, y) {
    var position = new Position(x, y);
    var camera = new Entity([position], "camera");
    return camera;
};

module.exports = EntityCreator;
