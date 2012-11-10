/**
 * If a new WebSocket is created it is handled here.
 */
define(["common/logger", "jsonrpchandler"], function(logger, jsonrpchandler) {
	"use strict";

	return {
		handle: function(websocket) {
			logger.debug("client connected");
			websocket.on("jsonrpc", function(jsonrpc, callback) {
				logger.debug("jsonrpc received", jsonrpc);
				jsonrpchandler.handle(jsonrpc, callback);
			});
			websocket.on("disconnect", function() {
				logger.debug("client disconnected");
			});
		}
	};
});