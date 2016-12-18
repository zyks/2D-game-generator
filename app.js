var http = require('http');
var express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', (req, res) => {
    res.render('home');
});


var server = http.createServer(app).listen(8000);
console.log("=> Server started");
