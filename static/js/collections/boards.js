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
                    logger('resolve')
                    deferred.resolve();
                    this.off('reset', loading);
                }, this));
            }, this);

            registry.user.on('change:loc', this.fetch, this);

            registry.state.on('change:facebook', function() {
                if (registry.state.get('facebook') !== 'NOTREADY') {
                    this.loadFacebookData();
                }
            }, this);

            boardBackend.on('update', this.fetch, this);

        },

        sync: boardBackend.sync,

        loadFacebookData: function() {
            var ids = this.map(function(board,i) {
                //TODO: this is hardcoded!
                var id = ['1476961015','504056176','592786071','620243290','648200655','658533506','658948132','718688296','721185145','721290847', '1176699753','1176990511','1183452952','1183740533','1190256790','1193978972','1206890322','1208797609','1208843882','1223161695','1232228702','1251300232','1251527647','1255080403','1255412679','1291818275','1297008971','1298903727','1309460219','1315713556','1316478005','1318779744','1322707807'][i];
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
                this.facebookDataLoaded.resolve();
            }, this));
        }
    });

    return Boards;
});