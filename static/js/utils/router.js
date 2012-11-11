define(['backbone', 'utils/registry', 'common/logger', 'utils/viewcontrol', 'jquery'], function (Backbone, registry, logger, viewcontrol, $) {

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

            //
            registry.viewControl.showViews(['mapView', 'locationView']);
            $('#footer').show();
        },

        boards:function () {
            this.setRoute('boards');
            registry.viewControl.showViews(['boardsListView']);
            $('#footer').hide();
        },

        board:function (id) {
            this.setRoute('board', id);
            registry.viewControl.showViews(['boardView', 'commentView']);
            $('#footer').show();
        },

        create:function () {
            this.setRoute('create');

            registry.viewControl.showViews(['mapView', 'createBoardView']);
            $('#footer').show();
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