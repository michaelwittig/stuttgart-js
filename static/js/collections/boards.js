define(
    ['underscore', 'backbone', 'models/board', 'utils/boardBackend', 'utils/registry'],
    function(_, Backbone, Board, boardBackend, registry) {

    var Boards = Backbone.Collection.extend({

        model: Board,

        initialize: function() {
            var deferred = $.Deferred();
            this.loading = deferred.promise();
            this.facebookDataLoaded = $.Deferred();

            this.on('reset', function loading() {
                this.facebookDataLoaded.done(_.bind(function() {
                    deferred.resolve();
                    this.off('reset', loading);
                }, this));
            }, this);

            registry.user.on('change:loc', this.fetch, this);

	    this.on('reset', this.loadFacebookData, this);
            registry.state.on('change:facebook', function() {
		    if (registry.state.get('facebook')) {
                    this.loadFacebookData();
                }
            }, this);

            boardBackend.on('update', this.fetch, this);

        },

        sync: boardBackend.sync,

        loadFacebookData: function() {
		if (this.isEmpty()) return;

            var ids = this.map(function(board,i) {
		return board.get('user')['id'];
            });

            registry.facebook.fetchUsers(ids, _.bind(function(err, res) {
                //TODO: handle err
                if (err) return;
                _.each(res, function(user) {
					this.each(function (board) {
						if (board.get('user')['id'] === user.uid) {
							board.set({
								photo: user.pic_square,
								creator: user.name
							});
						}
					});
                }, this);
                this.facebookDataLoaded.resolve();
            }, this));
        }
    });

    return Boards;
});