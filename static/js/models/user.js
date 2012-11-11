define(['backbone', 'jquery', 'utils/registry', 'common/logger'], function(Backbone, $, registry, logger) {

    var User = Backbone.Model.extend({
        defaults: {
            id: 0,
            name: '',
            photo: ''
	    //loc: {lat: 0, lng: 0}
        },

        initialize: function() {
    	    //TODO: get data from FB
            this.initLoc = $.Deferred();
            this.on('change:loc', function initLocation() {
                this.initLoc.resolve();
                this.off('change:loc', initLocation);
            }, this);
        },

        setPosition: function(loc) {
            var fallback = _.bind(function() {
                this.set('loc', {
		    lat: 48.770998,
		    lng: 9.157273
                });
            }, this);

            if (typeof loc !== 'undefined') {
                this.set('loc', loc);
                return;
            }

            if (!navigator.geolocation) {
                fallback();
                return;
            }

            navigator.geolocation.getCurrentPosition(_.bind(function(pos) {
                this.set('loc', {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            }, this), fallback);
        }
    });

    return User;
});