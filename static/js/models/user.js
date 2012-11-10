define(['backbone', function(Backbone) {

    var User = Backbone.Model.extend({
        defaults: {
            id: 0,
            name: '',
            photo: ''
        },

        initialize: function() {

        }

    });

    return User;
}]);