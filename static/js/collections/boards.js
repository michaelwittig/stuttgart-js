define(['underscore', 'backbone', 'models/board', 'utils/boardSync', 'utils/registry'], function(_, Backbone, Board, sync, registry) {

    var Boards = Backbone.Collection.extend({
        model: Board,
        initialize: function() {
            registry.user.on('change:loc', this.fetch, this);
        },
        sync: sync
    });

    return Boards;
});