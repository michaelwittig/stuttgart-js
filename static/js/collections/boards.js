define(['underscore', 'backbone', 'models/board', 'utils/sync', 'utils/registry'], function(_, Backbone, Board, sync, registry) {

    var Boards = Backbone.Collection.extend({
	model: Board,
	initialize: function() {
	},
	sync: sync
    });

    return Boards;
});