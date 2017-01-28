var Entity = require('./entity');
var PlayerInfo = require('../components/playerInfo');
var TileMap = require('../components/tileMap');
var Position = require('../components/position');
var Graphics = require('../components/graphics');
var TileMapGenerator = require('../TileMapGenerator');

var EntityCreator = function() {}

EntityCreator.prototype.createPlayer = function(name, socket) {
    let playerInfoComponent = new PlayerInfo(name, socket);
    let playerGraphicComponent = new Graphics("player");
    let playerPositionComponent = new Position(500, 500);
    let player = new Entity([
      playerInfoComponent,
      playerGraphicComponent,
      playerPositionComponent
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

module.exports = EntityCreator;
