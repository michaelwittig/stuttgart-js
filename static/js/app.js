define([
    'jquery',
    'utils/registry',
    'models/appState',
    'models/user',
    'utils/router',
    'utils/facebook',
    'views/appView',
    'collections/boards'
    ],
    function ($, registry, AppState, User, Router, Facebook, AppView, Boards) {

    var app = {};

    app.init = function() {
        registry.state = new AppState();
        registry.user = new User();
        registry.facebook = new Facebook();

        new Router();

        new Boards().fetch();

        $(function() {
            new AppView();
            Backbone.history.start();
        });
    };

    return app;
});
