define([], function() {
    "use strict";

	var conf = {};
    if (process.env.mode === "prod") {
		conf["mongo.host"] = "localhost";
		conf["mongo.db"] = "test";
		conf["redis.host"] = "localhost";
		conf["redis.port"] = 6379;
		conf["webServer.port"] = 3000;
    } else {
		conf["mongo.host"] = "localhost";
		conf["mongo.db"] = "test";
		conf["redis.host"] = "localhost";
		conf["redis.port"] = 6379;
		conf["webServer.port"] = 3000;
    }
	return conf;

});