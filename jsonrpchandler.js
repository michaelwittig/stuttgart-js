/**
 * JSON-RPC calls are handled here.
 */
define(["methodhandler"], function(methodhandler) {
	"use strict";

	return {
		handle: function(jsonrpc, callback) {
			methodhandler.handle(jsonrpc.method, jsonrpc.params, function(err, res) {
				if (err) {
					callback(err, {result: res, error: err, id: jsonrpc.id});
				} else {
					callback(unefined, {result: res, error: undefined, id: jsonrpc.id});
				}
			});
		}
	};
});