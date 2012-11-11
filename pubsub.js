define(["events", "redis", "config", "common/logger"], function(events, redis, config, logger) {
	"use strict";

	function redisErrorListener(redisClient) {
		redisClient.on("error", function(err) {
			logger.error("redis error", err);
			process.exit(1);
		});
	}

	var emitter = new events.EventEmitter();
	var redisPub;
	var redisSub;
	var subscriptions = {};

	function init(callback) {
		if (config["redis.passwd"]) {
			var cnt = 0;
			var error;
			redisPub.auth(config["redis.passwd"], function(err) {
				if (err) {
					error = err;
				}
				cnt += 1;
				if (cnt === 2) {
					if (error) {
						callback(error);
					} else {
						callback(undefined, true);
					}
				}
			});
			redisSub.auth(config["redis.passwd"], function(err) {
				if (err) {
					error = err;
				}
				cnt += 1;
				if (cnt === 2) {
					if (error) {
						callback(error);
					} else {
						callback(undefined, true);
					}
				}
			});
		} else {
			redisSub.on("message", function(channel, message) {
				message = JSON.parse(message);
				logger.debug("redis message", [channel, message]);
				var s = subscriptions[channel];
				if (s) {
					s.forEach(function(cb) {
						cb(message);
					});
				}
			});
			callback(undefined, true);
		}
	}

	return {
		start: function(callback) {
			callback(undefined, true);
			return;
			var connectCnt = 0;
			redisPub = redis.createClient(config["redis.port"], config["redis.host"], {no_ready_check: true});
			redisErrorListener(redisPub);
			redisPub.on("connect", function() {
				logger.debug("redis connect");
				connectCnt += 1;
				if (connectCnt === 2) {
					init(callback);
				}
			});
			redisSub = redis.createClient(config["redis.port"], config["redis.host"], {no_ready_check: true});
			redisErrorListener(redisSub);
			redisSub.on("connect", function() {
				logger.debug("redis connect");
				connectCnt += 1;
				if (connectCnt === 2) {
					init(callback);
				}
			});
		},
		stop: function(callback) {
			callback(undefined, true);
			return;
			redisPub.end();
			redisSub.end();
			callback(undefined, true);
		},
		"pub": function(channel, message) {
			logger.debug("redis pub", [channel, message]);
			emitter.emit(channel, message);
			return;
			redisPub.publish(channel, JSON.stringify(message));
		},
		/**
		 * @param channel Channel
		 * @param messageCB function(message)
		 */
		"sub": function(channel, messageCB) {
			emitter.on(channel, messageCB);
			return;
			if (!subscriptions[channel]) {
				subscriptions[channel] = [];
				logger.debug("redis sub", channel);
				redisSub.subscribe(channel);
			}
			subscriptions[channel].push(messageCB);
		},
		/**
		 * @param channel Channel
		 * @param messageCB function(message)
		 */
		"unsub": function(channel, messageCB) {
			emitter.removeListener(channel, messageCB);
			return;
			var s = subscriptions[channel];
			if (s) {
				var idx = s.indexOf(messageCB);
				if (idx !== -1) {
					subscriptions[channel] = s.slice(idx, 1);
				}
				if (subscriptions[channel].length === 0) {
					redisSub.unsubscribe(channel);
					delete subscriptions[channel];
				}
			} else {
				logger.error("can not unsubscribe, no channel!");
			}
		},
		"redisPub": function() {return redisPub},
		"redisSub": function() {return redisSub},
		"redisErrorListener": redisErrorListener
	};
});