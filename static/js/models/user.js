define(['backbone', 'jquery'], function(Backbone, $) {

    var User = Backbone.Model.extend({
        defaults: {
            id: 0,
            name: '',
            photo: ''
	    //loc: {lat: 0, lng: 0}
        },

        initialize: function() {

    	    //get data from FB
        }
    });

    return User;
});