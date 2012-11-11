/**
 * Invocations of methods (done by JSON-RPC) are handled here.
 */
define(["common/logger", "datastore", "authhandler", "demo"], function(logger, datastore, authhandler, demo) {
	"use strict";

	function isNonEmptyString(str, field) {
		field = field || "str";
		if (typeof str !== "string") {
			throw new Error(field + " must be a string");
		}
		if (str.length === 0) {
			throw new Error(field + " is empty");
		}
	}

	function isPositiveInteger(integer, field) {
		field = field || "int";
		if (typeof integer !== "number") {
			throw new Error(field + " must be a number");
		}
		if (integer < 0) {
			throw new Error(field + " must be positive");
		}
	}

	function isLoc(loc, field) {
		field = field || "loc";
		if (typeof loc.lng !== "number" || typeof loc.lat !== "number") {
			throw new Error(field + ".lng and " + field + ".lat must be a number");
		}
		if (loc.lng < -180 || loc.lng >= 180) {
			throw new Error(field + ".lng must be in [-180;180)");
		}
		if (loc.lat < -90 || loc.lat >= 90) {
			throw new Error(field + ".lat must be in [-90;90)");
		}
	}

	function isDistance(distance, field) {
		field = field || "distance";
		if (typeof distance !== "number") {
			throw new Error(field + " must be a number");
		}
		if (distance < 1 || distance > 100) {
			throw new Error(field + " must be in [1;100]");
		}
	}

	function isBoard(board) {
		isNonEmptyString(board.title, "board.title");
		isLoc(board.loc, "board.loc");
		if (board.expireIn !== undefined) {
			isPositiveInteger(board.expireIn, "board.expireIn");
		}
	}

	function isToken(token) {
		isNonEmptyString(token.type, "token.type");
		isNonEmptyString(token.value, "token.value");
	}

	function isBoardId(boardId) {
		isNonEmptyString(boardId, "boardId");
	}

	function isMessage(message) {
		isNonEmptyString(message, "message");
	}

	var methods = {
		"board:getall": function(loc, distance, callback) {
			logger.debug("board:getall", [loc, distance]);
			isLoc(loc);
			isDistance(distance);
			datastore.getBoards(loc, distance, callback);
		},
		"board:create": function(board, token, callback) {
			logger.debug("board:create", [board, token]);
			isBoard(board);
			isToken(token);
			authhandler.getUser(token, function(err, user) {
				if (err) {
                    logger.debug("board:create error");
					callback(err);
				} else {
                    logger.debug("board:create success");
					datastore.addBoard(user, board.title, board.loc, board.expireIn, callback);
				}
			});
		},
		"message:getall": function(boardId, callback) {
			logger.debug("message:getall", [boardId]);
			isBoardId(boardId);
			datastore.getMessages(boardId, callback);
		},
		"message:create": function(boardId, message, token, callback) {
			logger.debug("message:create", [boardId, message, token]);
			isBoardId(boardId);
			isMessage(message);
			isToken(token);
			authhandler.getUser(token, function(err, user) {
				if (err) {
					callback(err);
				} else {
					datastore.addMessage(user, boardId, message, callback);
				}
			});
		},
		"demo:start": function(loc, distance, callback) {
			logger.debug("demo:start", [loc, distance]);
			isLoc(loc);
			isDistance(distance);
			demo.start(loc, distance, 5);
			callback(undefined, true);
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