/**
 * Invocations of methods (done by JSON-RPC) are handled here.
 */
define(["common/logger", "datastore", "authhandler"], function(logger, datastore, authhandler) {
	"use strict";

	var methods = {
		"board:getall": function(loc, distance, callback) {
			logger.debug("board:getall", [loc, distance]);
			datastore.getBoards(loc, distance, callback);
		},
		"board:create": function(board, token, callback) {
			logger.debug("board:create", [board, token]);
			authhandler.getUser(token, function(err, user) {
				if (err) {
					callback(err);
				} else {
					datastore.addBoard(user, board.title, board.loc, callback);
				}
			});
		},
		"message:getall": function(boardId, callback) {
			logger.debug("message:getall", [boardId]);
			datastore.getMessages(boardId, callback);
		},
		"message:create": function(boardId, message, token, callback) {
			logger.debug("message:create", [boardId, message, token]);
			authhandler.getUser(token, function(err, user) {
				if (err) {
					callback(err);
				} else {
					datastore.addMessage(user, boardId, message, callback);
				}
			});
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
				if (fn.length != params.length) {
					callback(new Error(fn.length + " parameters are expected, you gave me " + params.length));
				} else {
					fn.apply(undefined, params);
				}
			} else {
				callback(new Error("No JSON-RPC handler found for method " + method));
			}
		}
	};
});