define(
  ['jquery', 'utils/registry', 'models/appState' ,'models/user', 'utils/router'],
  function($, registry, appState, User) {

  registry.state = new AppState();
  registry.user = new User();

  new Router();

  $(function() {
    new AppView();
    Backbone.history.start();
  });
});