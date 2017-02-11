var http = require('http');
var express = require('express');
var ejs = require('ejs');
var socket = require('socket.io')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Engine = require('./engine/engine');
var EntityCreator = require('./creators/entityCreator');
var SendGameStateSystem = require('./systems/SendGameStateSystem');
var PlayerMotionSystem = require('./systems/playerMotionSystem');
var EnemyMotionSystem = require('./systems/enemyMotionSystem');
var PlayerShootingSystem = require('./systems/PlayerShootingSystem');
var MovementSystem = require('./systems/movementSystem');
var PlayerCollisionSystem = require('./systems/playerCollisionSystem');
var BulletCollisionSystem = require('./systems/bulletCollisionSystem');
var CharacterDeathSystem = require('./systems/characterDeathSystem');
var PlayerDoorInteractionSystem = require('./systems/playerDoorInteractionSystem');
var FrameProvider = require('./engine/FrameProvider');
var Config = require('./config');


var Server = function() {
    this._app = express();
    this._server = http.createServer(this._app);
    this._io = socket(this._server);
    this._engine = new Engine();
    this._entityCreator = new EntityCreator();
    this._cookiesSecret = "cha8423jfsd923kf5";
    this._frameProvider = new FrameProvider();
}

Server.prototype.configure = function() {
    this._setServerOptions();
    this._setRouting();
    this._registerComponentsGroups();
    this._addSystems();
}

Server.prototype.run = function(port) {
    this._server.listen(port);
    console.log("=> Server started");
    this._initializeMap();
    this._frameProvider.addAction(this._engine.update.bind(this._engine));
    this._frameProvider.start(10);
}

Server.prototype._initializeMap = function() {
    let map = this._entityCreator.createMap();
    this._engine.entities.add(map);
    let adjustPosition = function(e) {
        return { x: (e.x + 0.5) * Config.TILE_SIZE, y: (e.y + 0.5) * Config.TILE_SIZE } 
    }
    let spawns = map.components.get("TileMap").spawns.map(adjustPosition);
    let doors = map.components.get("TileMap").doors.map(adjustPosition);
    // for(let spawn of spawns)
    //     this._engine.entities.add(this._entityCreator.createEnemy(spawn.x, spawn.y));
    for (let door of doors) {
        let key = this._entityCreator.createKey();
        this._engine.entities.add(key);
        this._engine.entities.add(
            this._entityCreator.createDoor(door.x, door.y, key.id)
        );
    }
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

Server.prototype._registerComponentsGroups = function() {
    this._engine.entities.registerGroup('bullets', ['Bullet'])
    this._engine.entities.registerGroup('players', ['PlayerInfo']);
    this._engine.entities.registerGroup('enemies', ['EnemyInfo']);
    this._engine.entities.registerGroup('movement', ['Motion', 'Position']);
    this._engine.entities.registerGroup('mapLayers', ['TileMap']);
    this._engine.entities.registerGroup('characters', ['Character']);
    this._engine.entities.registerGroup('doors', ['DoorInfo']);
}

Server.prototype._addSystems = function() {
    this._engine.addSystem(new PlayerMotionSystem(this._engine), 0);
    this._engine.addSystem(new EnemyMotionSystem(this._engine), 0.25);
    this._engine.addSystem(new PlayerShootingSystem(this._engine, this._entityCreator), 0.5);
    this._engine.addSystem(new MovementSystem(this._engine), 1);
    this._engine.addSystem(new PlayerCollisionSystem(this._engine), 2);
    this._engine.addSystem(new BulletCollisionSystem(this._engine), 3);
    this._engine.addSystem(new CharacterDeathSystem(this._engine), 4);
    this._engine.addSystem(new PlayerDoorInteractionSystem(this._engine), 5);
    this._engine.addSystem(new SendGameStateSystem(this._engine), 6);
}

Server.prototype._handleSocketConnection = function(socket) {
    this._registerNewPlayer(socket);
    socket.on('disconnect', this._unregisterPlayer.bind(this, socket));
    socket.on('mouseMove', (data) => {
        player = this._engine.entities.getById(socket.playerId);
        player.components.get("PlayerInfo").mousePosition = data;
    });
    socket.on('keyDown', (data) => {
        // console.log(`Player ${socket.playerNickname} has pressed key: ${data.action}`);
        player = this._engine.entities.getById(socket.playerId);
        player.components.get("PlayerInfo").pressed[data.action] = true;
    });
    socket.on('keyUp', (data) => {
        player = this._engine.entities.getById(socket.playerId);
        player.components.get("PlayerInfo").pressed[data.action] = false;
    });
}

Server.prototype._registerNewPlayer = function(socket) {
    try {
        var nickname = this._getUserNicknameFromSocketCookies(socket);
        console.log(`=> New player ${nickname} connected`);
        var player = this._entityCreator.createPlayer(nickname, socket);
        socket.emit('registered', { nickname: nickname, playerId: player.id });
        socket.playerId = player.id;
        socket.playerNickname = nickname;
        this._engine.entities.add(player);
    } catch(err) {
        console.log(err);
        socket.disconnect();
    }
}

Server.prototype._unregisterPlayer = function(socket) {
    console.log(`=> Player ${socket.playerId}: ${socket.playerNickname} disconnected`);
    player = this._engine.entities.getById(socket.playerId);
    this._engine.entities.remove(player);
}

Server.prototype._getUserNicknameFromSocketCookies = function(socket) {
    var signedNickname = decodeURIComponent(
        socket.handshake.headers.cookie
        .split(';')
        .find((c) => c.indexOf('nickname') >= 0)
        .split('=')
        .pop()
    );
    var nickname = cookieParser.signedCookie(signedNickname, this._cookiesSecret);
    if (!nickname || nickname === signedNickname)
        throw "Invalid signed cookie value";
    return nickname;
}


module.exports = Server;
