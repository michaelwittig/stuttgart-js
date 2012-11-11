define(['backbone', 'utils/messageBackend'], function(Backbone, messageBackend) {

    var Message = Backbone.Model.extend({

	idAttribute: '_id',

        defaults: {
            user: '',
	    createdAt: '',
            content: '',
            photo: ''
        },

	sync: messageBackend.sync,

        initialize: function() {

        }

    });

    return Message;
});