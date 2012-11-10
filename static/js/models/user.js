define(['backbone', 'jquery'], function(Backbone, $) {

    var User = Backbone.Model.extend({
        defaults: {
            id: 0,
            name: '',
            photo: ''
	    //loc: {lat: 0, lng: 0}
        },

        initialize: function() {
    	    //TODO: get data from FB
        },

        setPosition: function() {
            var fallback = _.bind(function() {
                this.set('loc', {
                    lat: 51,
                    lng: -0.1
                });
            }, this);

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