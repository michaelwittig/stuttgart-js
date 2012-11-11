/**
 * JSON-RPC calls are handled here.
 */
define(["methodhandler", "common/logger"], function(methodhandler, logger) {
	"use strict";

	return {
		handle: function(jsonrpc, callback) {
			try {
				methodhandler.handle(jsonrpc.method, jsonrpc.params, function(err, res) {
					if (err) {
						callback(err, {result: null, error: err, id: jsonrpc.id});
					} else {
						callback(undefined, {result: res, error: null, id: jsonrpc.id});
					}
				});
			} catch (err) {
				callback(err, {result: null, error: err, id: jsonrpc.id});
			}
		}
	};
});