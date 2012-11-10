define(['backbone', 'utils/geo', 'utils/registry'], function(Backbone, geo, registry) {

    var LocationView = Backbone.View.extend({

        el: '#location-view',

        initialize: function() {
            this.$input = this.$('#location-input');
        },

        events: {
            'click #update': 'searchLocation'
        },

        searchLocation: function(e) {
            e.preventDefault();

            geo.addressToCoords(this.$input.val(), function(err, lat, lng) {
                logger(lat, lng);
                if (err) {
                    // TODO: Error Message anzeigen lassen.
                    logger('Location not found');
                } else {
                    registry.user.set({lat: lat, lng: lng});
                }
            });
        },

        show: function() {
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        }
    });

    return LocationView;

});