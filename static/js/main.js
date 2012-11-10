require.config( {
  deps: [
    'common/logger'
  ],
  paths: {
    jquery: ['http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min', 'lib/jquery-1.8.2'],
    leaflet: ['http://cdn.leafletjs.com/leaflet-0.4/leaflet', 'lib/leaflet'],
    handlebars: 'lib/handlebars-1.0.rc.1',
    hbs: 'lib/hbs',
    json2: 'lib/json2',
    i18nprecompile: 'lib/i18nprecompile',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
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
    }
  },
  baseUrl: 'js',
  hbs: {
    disableI18n: true,
    disableHelpers: true
  }
});

require(['app'], function(app) {
  app.init();
});
