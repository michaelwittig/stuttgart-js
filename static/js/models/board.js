define(['backbone', function(Backbone) {

    var Board = Backbone.Model.extend({
        defaults: {
            title: '',
            loc: {
                lat: 0,
                lng: 0
            },
            distance: 0
        },

        initialize: function() {

        }

    });

    return Board;
}]);