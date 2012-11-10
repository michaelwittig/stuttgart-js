define([
    'jquery',
    'utils/registry',
    'models/appState' ,
    'models/user',
    'utils/router',
    'views/appView',
    'collections/boards'
    ],
    function ($, registry, AppState, User, Router, AppView, Boards) {

    var app = {};

    app.init = function() {
        registry.state = new AppState();
        registry.user = new User();

        new Router();

	new Boards().fetch();


	$(function() {
            new AppView();
            Backbone.history.start();
        });
    };

    return app;
});