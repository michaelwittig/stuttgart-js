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

	function addMessage(boardId, message) {
		message = message || "Uh yeah";
		jsonrpchandler.handle({
			method: "message:create",
			params: [boardId, message, {type:"happy", value: "TEST"}],
			id: "1"
		}, function(err, res) {
			if (err) {
				logger.debug("message:create: error in JSON-RPC", err);
			} else {
				logger.debug("message:create: success in JSON-RPC", res);
			}
		});
	}

	function addBoard(title, lng, lat) {
		title = title || "Hello";
		lng = lng || 48.742323;
		lat = lat || 9.308228;
		jsonrpchandler.handle({
			method: "board:create",
			params: [{title: title, loc: {lng: lng, lat: lat}}, {type:"happy", value: "TEST"}],
			id: "1"
		}, function(err, res) {
			if (err) {
				logger.debug("board:create: error in JSON-RPC", err);
			} else {
				logger.debug("board:create: success in JSON-RPC", res);
				//addMessage(res.result._id, "Alles super");
				//addMessage(res.result._id, "Find ich auch");
				//addMessage(res.result._id, "...");
			}
		});
	}

	function getBoards(lng, lat) {
		lng = lng || 48.742323;
		lat = lat || 9.308228;
		jsonrpchandler.handle({
			method: "board:getall",
			params: [{lng: lng, lat: lat}, 5.0],
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

	function setUpDB() {
		addBoard("Coworking", 48.771309, 9.157273);
		addBoard("S-Bahn", 48.770268, 9.156514);
		addBoard("REWE", 48.770901,9.15778);
		addBoard("Farbenhaus", 48.772235, 9.15686);
		addBoard("MG-Fitness", 48.772067,9.159118);
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