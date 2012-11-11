define(
    ['underscore', 'backbone', 'models/message', 'utils/messageBackend', 'utils/registry'],
    function(_, Backbone, Message, messageBackend, registry) {

    var Messages = Backbone.Collection.extend({

        model: Message,

        initialize: function(boardId) {
            var deferred = $.Deferred();
            this.loading = deferred.promise();
            this.facebookDataLoaded = $.Deferred();

            this.on('reset', function loading() {
		logger('reset messages')
                this.facebookDataLoaded.done(_.bind(function() {
                    logger('resolve messages')
                    deferred.resolve();
                    this.off('reset', loading);
                }, this));
            }, this);


            this.boardId = boardId;
            this.on('reset', this.loadFacebookData, this);
            messageBackend.on('update', this.fetch, this);

            this.fetch();

        },

        sync: messageBackend.sync,

        loadFacebookData: function() {
            var ids = this.map(function(message,i) {
		return message.get('user')['id'];
            });

	    if (!ids.length) {
		this.facebookDataLoaded.resolve();
	    }

            registry.facebook.fetchUsers(ids, _.bind(function(err, res) {
                //TODO: handle err
                if (err) return;
                _.each(res, function(user) {
                    var message = this.find(function(message) {
                        return message.get('user')['id'] === user.uid;
                    });
                    message.set({
                        photo: user.pic_square,
                        username: user.name
                    });
                }, this);
                this.facebookDataLoaded.resolve();
            }, this));
        }
    });

    return Messages;
});