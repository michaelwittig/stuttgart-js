define(['backbone', 'utils/registry'], function (Backbone, registry) {

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