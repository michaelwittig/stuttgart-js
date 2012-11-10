/**
 * Invocations of methods (done by JSON-RPC) are handled here.
 */
define(["common/logger"], function(logger) {
	"use strict";

	var methods = {
		"test": function(param1, param2, callback) {
			logger.debug("test", {a: param1, b: param2});
			callback(undefined, {a: 10});
		},
		"board:create": function(board, callback) {
			logger.debug("board:create", board);
			callback(new Error("NOT IMPLEMENTED"), undefined);
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
				params.push(callback);
				fn.apply(undefined, params);
			} else {
				callback(new Error("No JSON-RPC handler found for method " + method));
			}
		}
	};
});