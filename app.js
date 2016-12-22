var http = require('http');
var express = require('express');
var ejs = require('ejs');

var app = express();
app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);


app.get('/', (req, res) => {
    res.render('home', { message: "Hello world!" });
});

var server = http.createServer(app).listen(8000);
console.log("=> Server started");
