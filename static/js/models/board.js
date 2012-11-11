define(['backbone', 'utils/boardBackend'], function(Backbone, boardBackend) {

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
            creator: '',
            expireIn: 0
        },

	sync: boardBackend.sync,

        initialize: function() {

        }

    });

    return Board;
});