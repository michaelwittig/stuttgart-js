/**
 * We listen on a port for websocket and http requests.
 */
define(["node-static", "socket.io", "redis", "http", "common/logger", "config", "wshandler"], function(nodestatic, socketio, redis, http, logger, config, wshandler) {
	"use strict";

    var fileServer = new(nodestatic.Server)('./static');
    var webServer;
    var websocketServer;
	var redisAuths = 0;

	function startServer(redisPub, redisSub, redisClient, callback) {
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
				redisPub : redisPub,
				redisSub : redisSub,
				redisClient : redisClient
			})
		});
		websocketServer.sockets.on("connection", function (websocket) {
			wshandler.handle(websocket);
		});
		websocketServer.server.on("close", function() {
			logger.notice("Websocketserver has stopped!");
		});
		callback();
	}

	function redisAuthCB(err, redisPub, redisSub, redisClient, callback) {
		if (err) {
			logger.error("redis auth failure", err);
			process.exit(1);
		} else {
			redisAuths += 1;
			if (redisAuths === 3) {
				startServer(redisPub, redisSub, redisClient, callback);
			}
		}
	}

	function redisAuth(redisPub, redisSub, redisClient, callback) {
		redisAuths = 0;
		redisPub.auth(config["redis.passwd"], function(err) {
			redisAuthCB(err, redisPub, redisSub, redisClient, callback);
		});
		redisSub.auth(config["redis.passwd"], function(err) {
			redisAuthCB(err, redisPub, redisSub, redisClient, callback);
		});
		redisClient.auth(config["redis.passwd"], function(err) {
			redisAuthCB(err, redisPub, redisSub, redisClient, callback);
		});
	}

	function setUpRedisListener(redisClient) {
		redisClient.on("connect", function() {
			logger.debug("redis connect");
		});
		redisClient.on("error", function(err) {
			logger.error("redis error", err);
			System.exit(1);
		});
	}

    return {
        start: function(callback) {
			var redisPub = redis.createClient(config["redis.port"], config["redis.host"], {no_ready_check: true});
			setUpRedisListener(redisPub);
			var redisSub = redis.createClient(config["redis.port"], config["redis.host"], {no_ready_check: true});
			setUpRedisListener(redisSub);
			var redisClient = redis.createClient(config["redis.port"], config["redis.host"], {no_ready_check: true});
			setUpRedisListener(redisClient);
			if (config["redis.passwd"]) {
				redisAuth(redisPub, redisSub, redisClient, callback);
			} else {
				startServer(redisPub, redisSub, redisClient, callback);
			}
        },
        stop: function(callback) {
            webServer.close(callback);
        }
    };
});