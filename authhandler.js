/**
 * The auth handler validates a token based on the type and converts it into an User.
 */
define(["request", "common/logger", "cache"], function(request, logger, cache) {
	"use strict";

	function tokenToCacheKey(token) {
		return token.type + ":" + token.value;
	}

	var types = {
		"facebook": function(token, callback) {
			request({url:"https://graph.facebook.com/me?access_token=" + token, json: true}, function (err, response, body) {
				if (err) {
					callback(err);
				} else {
					if (body.error) {
						callback(new Error(body.error.message));
					} else {
						callback(undefined, {"type": "facebook", "id": body.id});
					}
				}
			});
		},
		"happy": function(token, callback) {
			callback(undefined, {"type": "happy", "id": token});
		}
	};

	function lookup(token, callback) {
		var fn = types[token.type];
		if (typeof fn === "function") {
			fn(token.value, function(err, res) {
				if (err) {
					callback(err);
				} else {
					cache.put(tokenToCacheKey(token), res, 10 * 60, function(err) {
						if (err) {
							callback(err);
						} else {
							callback(undefined, res);
						}
					});
				}
			});
		} else {
			callback(new Error("no handler for token type " + token.type));
		}
	}

	function cacheLookup(token, callback) {
		cache.get(tokenToCacheKey(token), function(err, res) {
			if (err) {
				callback(err);
			} else {
				if (res) {
					logger.debug("we hit the cache :)");
					callback(undefined, res);
				} else {
					logger.debug("cache miss :(");
					lookup(token, callback);
				}
			}
		});
	}

	return {
		/**
		 * @param token Token
		 * @param callback Callback(err, User)
		 */
		getUser: function(token, callback) {
			cacheLookup(token, callback);
		}
	};
});