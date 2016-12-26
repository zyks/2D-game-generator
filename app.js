var Server = require('./server');

var server = new Server();
server.configure();
server.setRouting();
server.run(8000);
