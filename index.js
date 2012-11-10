/**
 * The server is started and some stuff around the process is done here.
 */
var requirejs = require("requirejs");

requirejs.config({
	nodeRequire: require
});

requirejs(["server", "pubsub", "cache", "common/logger", "jsonrpchandler"], function(server, pubsub, cache, logger, jsonrpchandler) {
	"use strict";

	process.on("uncaughtException", function (err) {
		logger.error("uncaught exception", err);
		process.exit(1);
	});

	process.on("SIGINT", function () {
		logger.notice("Going down...");
		server.stop(function(err) {
			if (err) {
				logger.error("can not stop", err);
				process.exit(1);

			} else {
				logger.notice("stopped");
				process.exit(0);
			}
		});
	});

	function getMessages(boardId) {
		jsonrpchandler.handle({
			method: "message:getall",
			params: [boardId],
			id: "1"
		}, function(err, res) {
			if (err) {
				logger.debug("message:getal: error in JSON-RPC", err);
			} else {
				logger.debug("message:getal: success in JSON-RPC", res);
			}
		});
	}

	function addMessage(boardId) {
		jsonrpchandler.handle({
			method: "message:create",
			params: [boardId, "Uh yeah", {type:"happy", value: "TEST"}],
			id: "1"
		}, function(err, res) {
			if (err) {
				logger.debug("message:create: error in JSON-RPC", err);
			} else {
				logger.debug("message:create: success in JSON-RPC", res);
			}
		});
	}

	function addBoard() {
		jsonrpchandler.handle({
			method: "board:create",
			params: [{title: "Hello", loc: {lng: 48.742323, lat: 9.308228}}, {type:"happy", value: "TEST"}],
			id: "1"
		}, function(err, res) {
			if (err) {
				logger.debug("board:create: error in JSON-RPC", err);
			} else {
				logger.debug("board:create: success in JSON-RPC", res);
			}
		});
	}

	function getBoards() {
		jsonrpchandler.handle({
			method: "board:getall",
			params: [{lng: 48.742323, lat: 9.308228}, 5.0],
			id: "1"
		}, function(err, res) {
			if (err) {
				logger.debug("board:getall: error in JSON-RPC", err);
			} else {
				logger.debug("board:getall: success in JSON-RPC", res);
				setTimeout(getMessages(res.result[0]._id), 500);
			}
		});
	}

	pubsub.start(function(err) {
		if (err) {
			logger.error("can not start pubsub", err);
			process.exit(1);
		} else {
			cache.start(function(err) {
				if (err) {
					logger.error("can not start cache", err);
					process.exit(1);
				} else {
					server.start(function(err) {
						if (err) {
							logger.error("can not start server", err);
							process.exit(1);
						} else {
							logger.notice("started");
						}
					});
				}
			});
		}
	});

});