define(['backbone', 'utils/registry', 'common/logger', 'utils/viewcontrol', 'jquery', 'utils/socket'], function (Backbone, registry, logger, viewcontrol, $, socket) {

    var Router = Backbone.Router.extend({
        routes:{
            '':'goStart',
            'start': 'start',
            'demo': 'demo',
            'vote': 'vote',
            'home':'home',
            'home/:lat/:lng':'home',
            'boards':'boards',
            'board/:id':'board',
            'create':'create',
            '*404': 'goStart'
        },

        goStart:function () {
            this.navigate('start', {trigger:true, replace:true});
        },

        demo:function() {

            socket.emit('jsonrpc', {
                jsonrpc: '2.0',
                method: 'demo:start',
                id: _.uniqueId(),
                params: [
                    registry.user.get('loc'),
                    1
                ]
            });

            logger('demo');
            this.navigate('home', {trigger:true, replace:true});
        },

        start:function() {
            registry.viewControl.showViews(['mapView', 'locationView', 'layerInitView']);
            $('#footer').show();
            this.setRoute('home');
        },

        vote:function() {
	        registry.viewControl.showViews(['layerVoteView'], true);
            $('#footer').show();
            this.setRoute('home');
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