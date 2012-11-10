define(
    ['jquery', 'utils/registry', 'models/appState' , 'models/user', 'utils/router', 'utils/facebook'],
    function ($, registry, appState, User, Facebook) {

        registry.state = new AppState();
        registry.user = new User();
        registry.facebook = new Facebook();

        new Router();

        $(function () {
            new AppView();
            Backbone.history.start();
        });
    });