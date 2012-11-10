require.config({
    deps: [
	'common/logger',
    ],
    paths: {
	jquery: ['http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min', 'libs/jquery-1.8.2'],
	leaflet: ['http://cdn.leafletjs.com/leaflet-0.4/leaflet', 'libs/leaflet'],
	handlebars: 'libs/handlebars-1.0.rc.1',
	hbs: 'libs/hbs',
	json2: 'libs/json2',
	i18nprecompile: 'libs/i18nprecompile',
	underscore: 'libs/underscore',
	backbone: 'libs/backbone',
	'socket.io': '/socket.io/socket.io'
    },
    shim: {
	leaflet: {
	    exports: 'L'
        },
	handlebars: {
	    exports: 'Handlebars'
        },
	underscore: {
	    exports: '_'
        },
	backbone: {
	    deps: ['underscore', 'jquery'],
	    exports: 'Backbone'
        },
	'socket.io': {
	    exports: 'io'
	},
    'libs/moment': {
	exports: 'moment'
    }
    },
    baseUrl: 'js',
    hbs: {
	disableI18n: true,
	disableHelpers: true,
	helperPathCallback: function(name) {return 'helpers/' + name;}
    }
});

require(['app', 'helpers/timeago'], function(app) {
    app.init();
});