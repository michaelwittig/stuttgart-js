define(['backbone', 'jquery'], function(Backbone, $) {

    var User = Backbone.Model.extend({
        defaults: {
            id: 0,
            name: '',
            photo: ''
        },

        initialize: function() {
            this.set('loc', {lat: 0, lng: 0});
    	    //get data from FB
        }
    });

    return User;
});