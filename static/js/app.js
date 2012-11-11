define([
    'jquery',
    'backbone',
    'utils/registry',
    'models/appState',
    'models/user',
    'utils/router',
    'utils/facebook',
    'views/appView',
    'collections/boards'
    ],
    function ($, Backbone, registry, AppState, User, Router, Facebook, AppView, Boards) {

    var app = {};

    app.init = function() {
        registry.state = new AppState();
        registry.user = new User();
        registry.facebook = new Facebook();
        registry.boards = new Boards();
        registry.router = new Router();

        var cb = function(ev, data) {
            if (data.name === 'home' && typeof data.params !== 'undefined') {
                registry.user.setPosition(data.params);
            } else {
                registry.user.setPosition();
            }
            registry.state.off('change:route', cb);
        };

        registry.state.on('change:route', cb);

        $(function() {
            new AppView();
            Backbone.history.start();
        });
    };

    return app;
});
