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
                //TODO: this is hardcoded!
                var id = ['1476961015','504056176','592786071','620243290','648200655','658533506','658948132','718688296','721185145','721290847'][i];
                message.set('user', {id: id});
                return id;
                // return message.get('user')['id'];
            });
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