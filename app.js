var Server = require('./server');

var server = new Server();
server.configure();
server.run(8000);
