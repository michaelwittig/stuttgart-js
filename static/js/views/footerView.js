define(['backbone', 'views/locationView'], function(Backbone, LocationView) {

    var FooterView = Backbone.View.extend({

        el: '#map-footer',

        initialize: function() {
            this.locationView = new LocationView();
        }
    });

    return FooterView;
});