var http = require('http');
var express = require('express');
var ejs = require('ejs');
var socket = require('socket.io')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Engine = require('./engine/engine');
var EntityCreator = require('./engine/entityCreator');


var Server = function() {
    this._app = express();
    this._server = http.createServer(this._app);
    this._io = socket(this._server);
    this._engine = new Engine();
    this._entityCreator = new EntityCreator();
    this._cookiesSecret = "cha8423jfsd923kf5";
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
    this._app.use(cookieParser(this._cookiesSecret));
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._io.on('connection', this._handleSocketConnection.bind(this));
}

Server.prototype._registerComponentsGroups = function() {
    this._engine.entities.registerGroup('players', ['PlayerInfo']);
}

Server.prototype._addSystems = function() {

}

Server.prototype._setRouting = function() {
    this._app.get('/', (req, res) => {
        let nickname = '';
        if (req.signedCookies.nickname)
            nickname = req.signedCookies.nickname;
        res.render('login', { nicknamePlaceholder: nickname });
    });

    this._app.post('/', (req, res) => {
        res.cookie('nickname', req.body.nickname, { signed: true });
        res.render('game', { message: `Hello ${req.body.nickname}!` });
    });
}

Server.prototype._handleSocketConnection = function(socket) {
    this._registerNewPlayer(socket);
    socket.on('disconnect', this._unregisterPlayer.bind(this, socket));
}

Server.prototype._registerNewPlayer = function(socket) {
    var nickname = this._getUserNicknameFromSocketCookies(socket);
    if (!nickname) socket.disconnect();

    console.log(`=> New player ${nickname} connected`);
    var player = this._entityCreator.createPlayer(nickname, socket);
    socket.playerId = player.id;
    socket.playerNickname = nickname;
    this._engine.entities.add(player);
}

Server.prototype._unregisterPlayer = function(socket) {
    console.log(`=> Player ${socket.playerId}: ${socket.playerNickname} disconnected`);
    player = this._engine.entities.getById(socket.playerId);
    this._engine.entities.remove(player);
}

Server.prototype._getUserNicknameFromSocketCookies = function(socket) {
    var signedNickname = decodeURIComponent(
        socket.handshake.headers.cookie
        .split(";")
        .find((c) => c.indexOf('nickname') >= 0)
        .split('=')
        .pop()
    );
    var nickname = cookieParser.signedCookie(signedNickname, this._cookiesSecret);
    if (!nickname || nickname === signedNickname) {
        socket.disconnect();
        return false;
    }
    return nickname;
}


module.exports = Server;
