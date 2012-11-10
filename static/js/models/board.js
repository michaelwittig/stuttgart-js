define(['backbone'], function(Backbone) {

    var Board = Backbone.Model.extend({

	idAttribute: '_id',

        defaults: {
            title: '',
            loc: {
                lat: 0,
                lng: 0
            },
            distance: 0,
            photo: '',
            creator: ''
            //expirationDate
        },

        initialize: function() {

        }

    });

    return Board;
});