define(
    ['underscore', 'backbone', 'models/board', 'utils/boardSync', 'utils/registry'],
    function(_, Backbone, Board, sync, registry) {

    var Boards = Backbone.Collection.extend({

        model: Board,

        initialize: function() {

            registry.user.on('change:loc', this.fetch, this);

            registry.state.on('change:facebook', function() {
                if (registry.state.get('facebook') !== 'NOTREADY') {
                    this.loadFacebookData();
                }
            }, this);

        },

        sync: sync,

        loadFacebookData: function() {
            var ids = this.map(function(board,i) {
                //TODO: this is hardcoded!
                var id = ['1476961015','504056176','592786071','620243290','648200655','658533506','658948132','718688296','721185145','721290847'][i];
                board.set('user', {id: id});
                return id;
                // return board.get('user')['id'];
            });
            registry.facebook.fetchUsers(ids, _.bind(function(err, res) {
                //TODO: handle err
                if (err) return;
                _.each(res, function(user) {
                    var board = this.find(function(board) {
                        return board.get('user')['id'] === user.uid;
                    });
                    board.set({
                        photo: user.pic_square,
                        creator: user.name
                    });
                }, this);

            }, this));
        }
    });

    return Boards;
});