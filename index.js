var requirejs = require("requirejs");

requirejs.config({
	nodeRequire: require
});

requirejs(["server", "common/logger"], function(server, logger) {
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

    server.start(function(err) {
        if (err) {
            logger.error("can not start", err);
            process.exit(1);
        } else {
            logger.notice("started");
        }
    });

});