const StaticServer = require("./staticServer");
const SocketServer = require("./socketServer");

StaticServer.start(3000);
SocketServer.start(8080);
