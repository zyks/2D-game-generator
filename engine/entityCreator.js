var Entity = require('./entity');
var PlayerInfo = require('../components/playerInfo');


var EntityCreator = function() {}

EntityCreator.prototype.createPlayer = function(name, socket) {
    var playerInfoComponent = new PlayerInfo(name, socket);
    var player = new Entity([playerInfoComponent], 'player');
    return player;
}


module.exports = EntityCreator;
