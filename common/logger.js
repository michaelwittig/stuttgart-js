define([], function() {
    "use strict";

    function log(level, message, data) {
		if (data === undefined) {
			console.log(new Date().toLocaleTimeString() + " " + level + ": " + message);
		} else {
			console.log(new Date().toLocaleTimeString() + " " + level + ": " + message, data);
		}
    }

    return {
        debug: function(message, data) {
            log("debug", message, data);
        },
        notice: function(message, data) {
            log("notice", message, data);

        },
        error: function(message, data) {
            log("error", message, data);

        }
    }
});