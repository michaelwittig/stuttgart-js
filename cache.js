define(["redis", "config", "common/logger", "pubsub"], function(redis, config, logger, pubsub) {
	var redisClient;

	function init(callback) {
		if (config["redis.passwd"]) {
			redisClient.auth(config["redis.passwd"], function(err) {
				if (err) {
					callback(err);
				} else {
					callback(undefined, true);
				}
			});
		} else {
			callback(undefined, true);
		}
	}

	return {
		start: function(callback) {
			redisClient = redis.createClient(config["redis.port"], config["redis.host"], {no_ready_check: true});
			pubsub.redisErrorListener(redisClient);
			redisClient.on("connect", function() {
				logger.debug("redis connect");
				init(callback);
			});
		},
		stop: function(callback) {
			redisClient.end();
			callback(undefined, true);
		},
		/**
		 * @param key Key (string)
		 * @param value Value
		 * @param expiry Expiry in seconds
		 * @param callback Callback
		 */
		put: function(key, value, expiry, callback) {
			redisClient.setex(key, expiry, JSON.stringify(value), callback);
		},
		/**
		 * @param key Key (string)
		 * @param callback Callback
		 */
		get: function(key, callback) {
			redisClient.get(key, function(err, res) {
				if (err) {
					callback(err);
				} else {
					if (typeof res === "string") {
						callback(undefined, JSON.parse(res));
					} else {
						callback(undefined, res);
					}
				}
			});
		},
		"redisClient": redisClient
	};
});