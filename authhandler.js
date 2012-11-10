define(["request", "common/logger"], function(request, logger) {
	"use strict";

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
		}
	};

	return {
		/**
		 * @param token Token
		 * @param callback Callback(err, User)
		 */
		getUser: function(token, callback) {
			var fn = types[token.type];
			if (typeof fn === "function") {
				fn(token.value, callback);
			} else {
				callback(new Error("no handler for token type " + token.type));
			}
		}
	};
});