define(["node-static", "socket.io", "redis", "http", "common/logger", "config"], function(nodestatic, socketio, redis, http, logger, config) {
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
                transports: ["websocket", "flashsocket", "xhr-polling"],
				store: new (socketio.RedisStore)({
					redisPub : redis.createClient(config["redis.port"], config["redis.host"], {}),
					redisSub : redis.createClient(config["redis.port"], config["redis.host"], {}),
					redisClient : redis.createClient(config["redis.port"], config["redis.host"], {})
				})
            });
            websocketServer.sockets.on("connection", function (websocket) {
                logger.debug("server", "Websocket client connected");
                websocket.on("jsonrpc", function(data, callback) {
                    logger.debug("Websocket client registering");
                    callback(); // TODO handle the request :)
                });
            });
            websocketServer.server.on("close", function() {
                logger.notice("Websocketserver has stopped!");
            });
            callback();
        },
        stop: function(callback) {
            webServer.close(callback);
        }
    };
});