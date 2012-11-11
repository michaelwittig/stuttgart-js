define(['backbone', 'utils/registry', 'common/logger'], function (Backbone, registry, logger) {

    var Router = Backbone.Router.extend({
        routes:{
            '':'goHome',
            'home':'home',
            'home/:lat/:lng':'home',
            'boards':'boards',
            'board/:id':'board',
            'create':'create',
            '*404': 'goHome'
        },

        goHome:function () {
            this.navigate('home', {trigger:true, replace:true});
        },

        home:function (lat, lng) {
            if (lat && lng) {
                this.setRoute('home', {lat:lat, lng:lng});
            } else {
                this.setRoute('home');
            }
        },

        boards:function () {
            this.setRoute('boards');
        },

        board:function (id) {
            this.setRoute('board', id);
        },

        create:function () {
            this.setRoute('create');
        },

        setRoute: function(name, params) {
            registry.state.trigger('route:' + name, params);
            registry.state.set('route', {
                name: name,
                params: params
            });
        }
    });

    return Router;
});