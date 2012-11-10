var requirejs = require("requirejs");

requirejs.config({
	nodeRequire: require
});

requirejs(["server", "logger"], function(server, logger) {
	"use strict";

    server.start(function(err) {
        if (err) {
            logger.error("can not start", err);
            process.exit(0);
        } else {
            logger.notice("started");
        }
    });

});