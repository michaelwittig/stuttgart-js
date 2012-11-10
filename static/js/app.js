define([
    'jquery',
    'utils/registry',
    'models/appState',
    'models/user',
    'utils/router',
    'utils/facebook',
    'views/appView'
    ],
    function ($, registry, AppState, User, Router, Facebook, AppView) {

    var app = {};

    app.init = function() {
        registry.state = new AppState();
        registry.user = new User();
        registry.facebook = new Facebook();

        new Router();

        $(function() {
            new AppView();
            Backbone.history.start();
         });
    };

    return app;
});
