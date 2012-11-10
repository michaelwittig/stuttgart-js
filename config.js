define([], function() {
    "use strict";

	var conf = {};
    if (process.env.mode === "prod") {
		conf["mongo.host"] = "localhost";
		conf["mongo.db"] = "test";
		conf["webServer.port"] = 3000;
    } else {
		conf["mongo.host"] = "localhost";
		conf["mongo.db"] = "test";
		conf["webServer.port"] = 3000;
    }
	return conf;

});