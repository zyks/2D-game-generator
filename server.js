var http = require('http');
var express = require('express');
var ejs = require('ejs');
var socket = require('socket.io')
var Engine = require('./engine/engine');
var EntityCreator = require('./engine/entityCreator');


var Server = function() {
    this._app = express();
    this._server = http.createServer(this._app);
    this._io = socket(this._server);
    this._engine = new Engine();
    this._entityCreator = new EntityCreator();
}

Server.prototype.configure = function() {
    this._setServerOptions();
    this._registerComponentsGroups();
    this._addSystems();
    this._setRouting();
}

Server.prototype.run = function(port) {
    this._server.listen(port);
    console.log("=> Server started");
}

Server.prototype._setServerOptions = function() {
    this._app.set('view engine', 'html');
    this._app.engine('html', ejs.renderFile);
    this._app.set('views', './views');
    this._app.use(express.static('./'));
    this._io.on('connection', this._handleSocketConnection.bind(this));
}

Server.prototype._registerComponentsGroups = function() {
    this._engine.entities.registerGroup('players', ['PlayerInfo']);
}

Server.prototype._addSystems = function() {

}

Server.prototype._setRouting = function() {
    this._app.use(express.static(__dirname + '/assets'));
    this._app.get('/', (req, res) => {
        res.render('home', { message: "Hello world!" });
    });
}

Server.prototype._handleSocketConnection = function(socket) {
    this._registerNewPlayer(socket);
    socket.on('disconnect', this._unregisterPlayer.bind(this, socket));
}

Server.prototype._registerNewPlayer = function(socket) {
    console.log("=> New player connected");
    // TODO: player name should be read from text input
    var player = this._entityCreator.createPlayer('alfred', socket);
    socket.playerId = player.id;
    this._engine.entities.add(player);
}

Server.prototype._unregisterPlayer = function(socket) {
    console.log("=> Player", socket.playerId,  "disconnected");
    player = this._engine.entities.getById(socket.playerId);
    this._engine.entities.remove(player);
}



module.exports = Server;
