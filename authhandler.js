define([], function() {
	"use strict";

	var types = {
		"facebook": function(token, callback) {
			callback(undefined, {"type": "facebook", "id": "XXX"})
		}
	}
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