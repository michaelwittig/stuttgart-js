define(['backbone', 'underscore', 'utils/geo', 'utils/registry'], function(Backbone, _, geo, registry) {

    var LocationView = Backbone.View.extend({

        el: '#sub-position',

        initialize: function() {
            this.$input = this.$('input');
            registry.user.on('change:loc', this.updateInput, this);
        },

        events: {
            'submit #updatepos-form': 'searchLocation',
            'click #updatepos': 'searchLocation',
            'click #getpos': 'currentLocation'
        },

        searchLocation: function(e) {
            e.preventDefault();

            geo.addressToCoords(this.$input.val(), function(err, lat, lng) {
                logger(lat, lng);
                if (err) {
                    // TODO: Error Message anzeigen lassen.
                    logger('Location not found', err);
                } else {
                    registry.user.set('loc', {lat: lat, lng: lng});
                }
            });
        },

        currentLocation: function(e) {
            e.preventDefault();
            registry.user.setPosition();
        },

        updateInput: function() {
            var loc = registry.user.get('loc');
            geo.coordsToAddress(loc.lat, loc.lng, _.bind(function(err, address) {
                this.$input.val('');
                this.$input.attr('placeholder', address);
            }, this));
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