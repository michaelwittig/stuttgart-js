/**
 * If a new WebSocket is created it is handled here.
 */
define(["common/logger", "jsonrpchandler", "common/locroom"], function(logger, jsonrpchandler, locroom) {
	"use strict";

	return {
		handle: function(websocket) {
			logger.debug("client connected");
			websocket.on("jsonrpc", function(jsonrpc, callback) {
				logger.debug("jsonrpc received", jsonrpc);
				if (jsonrpc.method === "board:getall") {
					logger.debug("board:getall magic");
					websocket.get("joined:locs", function (err, roomsToLeave) {
						logger.debug("board:getall magic, check");
						if (err) {
							callback(err);
						} else {
							if (roomsToLeave) {
								logger.debug("leave loc rooms " + roomsToLeave);
								roomsToLeave.forEach(function(roomToLeave) {
									websocket.leave(roomToLeave);
								});
							}
							var roomsToJoin = locroom.getRooms(jsonrpc.params[0], jsonrpc.params[1]);
							logger.debug("join loc rooms " + roomsToJoin);
							websocket.set("joined:locs", roomsToJoin, function () {
								roomsToJoin.forEach(function(roomToJoin) {
									websocket.join(roomToJoin);
								});
							});
							jsonrpchandler.handle(jsonrpc, callback);
						}
					});
				} else if (jsonrpc.method === "message:getall") {
					websocket.get("joined:board", function (err, roomToLeave) {
						if (err) {
							callback(err);
						} else {
							if (roomToLeave) {
								logger.debug("leave board room " + roomToLeave);
								websocket.leave(roomToLeave);
							}
							var roomToJoin = "board:" + jsonrpc.params[0];
							logger.debug("join board room " + roomToJoin);
							websocket.set("joined:board", roomToJoin, function () {
								websocket.join(roomToJoin);
							});
							jsonrpchandler.handle(jsonrpc, callback);
						}
					});
				} else {
					jsonrpchandler.handle(jsonrpc, callback);
				}
			});
			websocket.on("disconnect", function() {
				logger.debug("client disconnected");
			});
		}
	};
});