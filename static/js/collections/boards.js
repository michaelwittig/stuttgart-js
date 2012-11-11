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
                var id = ['1476961015','504056176','592786071','620243290','648200655','658533506','658948132','718688296','721185145','721290847', '1176699753','1176990511','1183452952','1183740533','1190256790','1193978972','1206890322','1208797609','1208843882','1223161695','1232228702','1251300232','1251527647','1255080403','1255412679','1291818275','1297008971','1298903727','1309460219','1315713556','1316478005','1318779744','1322707807',  '1677318031', '1678427757', '1681554169', '1693131135', '1695533757', '1698920826', '1717758919', '1732542396', '1735807898', '1736248329', '1741911738', '1747112310', '1749232385', '1754751284', '1767444982', '1774525920', '1785903946', '1794511475', '1794724048', '1798129763', '1799022826', '1808941053', '1810785993', '1812284858', '1815144168', '1816731497', '1822718593', '1827822921', '1830968354', '1833331311', '1835647275', '1838236931', '1839946315', '1840618458', '1842811054', '1850444483', '100000005509793', '100000007562898', '100000008940259', '100000013815041', '100000014175448', '100000016388809', '100000034218849', '100000034790775', '100000038860579', '100000052156581'][i];
                board.set('user', {id: id});
                return id;
                // return board.get('user')['id'];
            });
            registry.facebook.fetchUsers(ids, _.bind(function(err, res) {
                logger('loadFacebookData', err)
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