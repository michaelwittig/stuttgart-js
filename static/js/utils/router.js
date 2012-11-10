define(['utils/registry'], function (registry) {

    var Router = Backbone.Router.extend({
        routes:{
            '/home':'home'
        },

        home:function () {
            registry.state.trigger('route:home');
        }
    });

    return Router;
});