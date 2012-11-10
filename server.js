define(["node-static", "socket.io", "http", "common/logger", "config"], function(nodestatic, socketio, http, logger, config) {
	"use strict";

    var fileServer = new(nodestatic.Server)('./static');
    var webServer;
    var websocketServer;

    return {
        start: function(callback) {
            webServer = http.createServer(function (request, response) {
                request.addListener("end", function () {
                    fileServer.serve(request, response);
                });
            });
            webServer.listen(config["webServer.port"]);
            websocketServer = socketio.listen(webServer, {
                transports: ["websocket", "flashsocket", "xhr-polling"]
				// TODO redis store
            });
            websocketServer.sockets.on("connection", function (websocket) {
                logger.debug("server", "Websocket client connected");
                websocket.on("jsonrpc", function(data, callback) {
                    logger.debug("Websocket client registering");
                    callback(); // TODO handle the request :)
                });
            });
            websocketServer.server.on("close", function() {
                logger.info("Websocketserver has stopped!");
            });
            callback();
        },
        stop: function(callback) {
            webServer.close(callback);
        }
    };
});