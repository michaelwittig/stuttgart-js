define(['backbone'], function(Backbone) {

    var LocationView = Backbone.View.extend({

        el: '#location-view',

        initialize: function() {
            this.$input = this.$('#location-input');
        },

        events: {
            'submit #location-form': 'searchLocation'
        },

        searchLocation: function(e) {
            e.preventDefault();
            logger(this.$input.val())
        }
    });

    return LocationView;

});