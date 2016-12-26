var http = require('http');
var express = require('express');
var ejs = require('ejs');


var Server = function() {
    this._app = express();
}

Server.prototype.configure = function() {
    this._app.set('view engine', 'ejs');
    this._app.set('view engine', 'html');
    this._app.engine('html', ejs.renderFile);
}

Server.prototype.setRouting = function() {
    this._app.get('/', (req, res) => {
        res.render('home', { message: "Hello world!" });
    });
}

Server.prototype.run = function(port) {
    this._server = http.createServer(this._app);
    this._server.listen(port);
    console.log("=> Server started");
}


module.exports = Server;
