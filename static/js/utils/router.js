define(['backbone', 'utils/registry'], function (Backbone, registry) {

    var Router = Backbone.Router.extend({
        routes:{
            '':'goHome',
            'home':'home',
            'home/:lat/:lng':'home',
            'boards':'boards',
            'board/:id':'board',
            'create':'create',
            'create/:lat/:lng': 'create',
            '*404': 'goHome'
        },

        goHome:function () {
            this.navigate('home', {trigger:true, replace:true});
        },

        home:function (lat, lng) {
            if (lat && lng) {
                registry.state.trigger('route:home', {lat:lat, lng:lng});
            } else {
                registry.state.trigger('route:home');
            }
        },

        boards:function () {
            registry.state.trigger('route:boards');
        },

        board:function (id) {
            registry.state.trigger('route:board', id);
        },

        create:function (lat, lng) {
            if (lat && lng) {
                registry.state.trigger('route:create', {lat:lat, lng:lng});
            } else {
                registry.state.trigger('route:create');
            }
        }
    });

    return Router;
});