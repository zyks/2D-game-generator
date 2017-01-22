var Entity = require('./entity');
var PlayerInfo = require('../components/playerInfo');
var TileMap = require('../components/tileMap');
var TileMapGenerator = require('../TileMapGenerator');


var EntityCreator = function() {}

EntityCreator.prototype.createPlayer = function(name, socket) {
    var playerInfoComponent = new PlayerInfo(name, socket);
    var player = new Entity([playerInfoComponent], 'player');
    return player;
}


EntityCreator.prototype.createMap = function() {
  var tileMapGenerator = new TileMapGenerator();
  var tileMap = new TileMap(tileMapGenerator.generate(10, 10));
  var map = new Entity([tileMap], 'map');
  return map;
};

module.exports = EntityCreator;
