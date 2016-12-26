var http = require('http');
var express = require('express');
var ejs = require('ejs');
var socket = require('socket.io')


var Server = function() {
    this._app = express();
    this._server = http.createServer(this._app);
    this._io = socket(this._server);
}

Server.prototype.configure = function() {
    this._app.set('view engine', 'html');
    this._app.engine('html', ejs.renderFile);
    this._app.set('views', './views');
    this._app.use(express.static('./'));
    this._io.on('connection', this._registerPlayer);
}

Server.prototype.setRouting = function() {
    this._app.get('/', (req, res) => {
        res.render('home', { message: "Hello world!" });
    });
}

Server.prototype.run = function(port) {
    this._server.listen(port);
    console.log("=> Server started");
}

Server.prototype._registerPlayer = function(socket) {
    console.log("new player connected");
}


module.exports = Server;
