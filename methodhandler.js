/**
 * Invocations of methods (done by JSON-RPC) are handled here.
 */
define(["common/logger"], function(logger) {
	"use strict";

	var methods = {
		"board:getall": function(distance, callback) {
			callback(new Error("NOT IMPLEMENTED"), undefined);
		},
		"board:create": function(board, message, token, callback) {
			callback(new Error("NOT IMPLEMENTED"), undefined);
		},

		"message:getall": function(boardId, callback) {
			callback(new Error("NOT IMPLEMENTED"), undefined);
		},
		"message:create": function(boardId, message, token, callback) {
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