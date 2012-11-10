define([], function() {
    "use strict";

    function log(level, message, data) {
		if (data === undefined) {
			console.log(new Date().toLocaleTimeString() + " " + level + ": " + message);
		} else {
			console.log(new Date().toLocaleTimeString() + " " + level + ": " + message, data);
		}
    }

    var logger = function(message, data) {
	logger.debug.apply(this, arguments);
    };

    logger.debug = function(message, data) {
	log("debug", message, data);
    };

    logger.notice = function(message, data) {
	log("notice", message, data);

    };

    logger.error = function(message, data) {
	log("error", message, data);

    };

    if (typeof window !== "undefined") window.logger = logger;

    return logger;
});