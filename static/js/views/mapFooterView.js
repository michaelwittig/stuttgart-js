define(['backbone', 'views/locationView', 'views/createBoardView', 'utils/registry', 'common/logger'], function(Backbone, LocationView, CreateBoardView, registry, logger) {

    var MapFooterView = Backbone.View.extend({

        initialize: function() {
            this.locationView = new LocationView();
            this.createBoardView = new CreateBoardView();

            //registry.state.on('route:home', this.showLocationView, this);
            //registry.state.on('route:create', this.showCreateView, this);
        },

        /*
        show: function() {
            this.$el.show();
            this.showCreateView();
        },

        hide: function() {
            this.$el.hide();
            this.locationView.hide();
            this.createBoardView.hide();
        },
        */

        showCreateView: function() {
            this.createBoardView.show();
            this.locationView.hide();
        },

        showLocationView: function() {
            this.locationView.show();
            this.createBoardView.hide();
        }
    });

    return MapFooterView;
});