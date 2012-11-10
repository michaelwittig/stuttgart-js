define([
    'jquery',
    'utils/registry',
    'models/appState' ,
    'models/user',
    'utils/router',
    'views/appView'
    ],
    function ($, registry, AppState, User, Router, AppView) {

    var app = {};

    app.init = function() {
        registry.state = new AppState();
        registry.user = new User();

        new Router();

	$(function() {
            new AppView();
            Backbone.history.start();
        });
    };

    return app;
});