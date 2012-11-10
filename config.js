/**
 * Configuration for dev and prod.
 */
define([], function() {
    "use strict";

	var conf = {};
    if (process.env.mode === "prod") {
		conf["mongo.url"] = "mongodb://nodejitsu_nko3-stuttgart-js:2tpt0mq3omv1mtuk06q92bas0b@ds039267.mongolab.com:39267/nodejitsu_nko3-stuttgart-js_nodejitsudb9326938714";
		conf["redis.host"] = "nodejitsudb3383330325.redis.irstack.com";
		conf["redis.port"] = 6379;
		conf["redis.passwd"] = "nodejitsudb3383330325.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4";
		conf["webServer.port"] = 3000;
    } else {
		conf["mongo.url"] = "mongodb://localhost/test";
		conf["redis.host"] = "localhost";
		conf["redis.port"] = 6379;
		conf["webServer.port"] = 3000;
    }
	return conf;

});