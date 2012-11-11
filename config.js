/**
 * Configuration for dev and prod.
 */
define(["common/logger"], function(logger) {
    "use strict";

	var conf = {};
    if (process.env.NODE_ENV === "production") {
		logger.debug("production configuration");
		conf["mongo.url"] = "mongodb://nodejitsu_nko3-stuttgart-js:mn0tol2en4l6k3mhh78mpomsq1@ds039267.mongolab.com:39267/nodejitsu_nko3-stuttgart-js_nodejitsudb1204382411";
		conf["redis.host"] = "nodejitsudb3383330325.redis.irstack.com";
		conf["redis.port"] = 6379;
		conf["redis.passwd"] = "nodejitsudb3383330325.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4";
		conf["webServer.port"] = 3000;
		conf["fileServer.dir"] = "./static";
    } else if (process.env.NODE_ENV === "development") {
		logger.debug("production configuration");
		conf["mongo.url"] = "mongodb://localhost/test";
		conf["redis.host"] = "localhost";
		conf["redis.port"] = 6379;
		conf["webServer.port"] = 3000;
		conf["fileServer.dir"] = "./static";
	} else {
		logger.debug("lazy configuration");
		conf["mongo.url"] = "mongodb://nodejitsu_nko3-stuttgart-js:mn0tol2en4l6k3mhh78mpomsq1@ds039267.mongolab.com:39267/nodejitsu_nko3-stuttgart-js_nodejitsudb1204382411";
		conf["redis.host"] = "nodejitsudb3383330325.redis.irstack.com";
		conf["redis.port"] = 6379;
		conf["redis.passwd"] = "nodejitsudb3383330325.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4";
		conf["webServer.port"] = 3000;
		conf["fileServer.dir"] = "./static";
    }
	return conf;

});