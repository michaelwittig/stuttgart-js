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
            function fallback() {
                registry.user.set('loc', {
                    lat: 51,
                    lng: -0.1
                });
            }

            if (!navigator.geolocation) {
                fallback();
                return;
            }

            navigator.geolocation.getCurrentPosition(function(pos) {
                registry.user.set('loc', {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            }, fallback);
        }


    });

    return User;
});