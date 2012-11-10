/**
 * Invocations of methods (done by JSON-RPC) are handled here.
 */
define([], function() {
	"use strict";

	var methods = {
		test: function(params, callback) {
			callback(undefined, {});
		}
	};

	return {
		/**
		 *
		 * @param method Method
		 * @param params Params
		 * @param callback Callback(err, res)
		 */
		handle: function(method, params, callback) {
			var fn = methods[method];
			if (typeof fn === "function") {
				fn(params, callback);
			} else {
				callback(new Error("No JSON-RPC handler found for method " + method));
			}
		}
	};
});