/**
 * We listen on a port for websocket and http requests.
 */
define(["events", "node-static", "socket.io", "redis", "http", "common/logger", "config", "wshandler", "pubsub", "cache", "common/locroom"], function(events, nodestatic, socketio, redis, http, logger, config, wshandler, pubsub, cache, locroom) {
	"use strict";

    var fileServer = new(nodestatic.Server)(config["fileServer.dir"]);
    var webServer;
    var websocketServer;

    return {
        start: function(callback) {
			webServer = http.createServer(function (request, response) {
				if (request.url.indexOf("/socket.io") !== 0) {
					request.addListener("end", function () {
						fileServer.serve(request, response);
					});
				}
			});
			webServer.listen(config["webServer.port"]);
			websocketServer = socketio.listen(webServer, {
				transports: ["websocket", "flashsocket", "xhr-polling"],
				store: new (socketio.RedisStore)({
					redis: redis,
					redisPub : pubsub.redisPub(),
					redisSub : pubsub.redisSub(),
					redisClient : cache.redisClient()
				})
			});
			websocketServer.sockets.on("connection", function (websocket) {
				wshandler.handle(websocket);
			});
			websocketServer.server.on("close", function() {
				logger.notice("Websocketserver has stopped!");
			});
			pubsub.sub("messages", function(message) {
				var room = "board:" + message.boardId;
				logger.debug("send message to room " + room, message);
				websocketServer.sockets.in(room).emit("update", message);
			});
			pubsub.sub("boards", function(message) {
				var room = locroom.getRoom(message.loc);
				logger.debug("send message to room " + room, message);
				websocketServer.sockets.in(room).emit("update", message);
			});
			callback();
        },
		stop:function (callback) {
			webServer.close();
			pubsub.stop(function (err) {
				if (err) {
					callback(err);
				} else {
					cache.stop(function (err) {
						if (err) {
							callback(err);
						} else {
							callback(undefined, true);
						}
					});
				}
			});
		}
    };
});