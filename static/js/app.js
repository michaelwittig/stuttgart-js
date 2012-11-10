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

<<<<<<< HEAD
        app.boards = new Boards();
=======
        new Boards().fetch();
>>>>>>> 48a52d0d2f33a093bb1e79b5ce4369f583f18f56

        $(function() {
            new AppView();
            Backbone.history.start();
        });
    };

    return app;
});
