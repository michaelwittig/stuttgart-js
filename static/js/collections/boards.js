define(
    ['underscore', 'backbone', 'models/board', 'utils/boardSync', 'utils/registry'],
    function(_, Backbone, Board, sync, registry) {

    var Boards = Backbone.Collection.extend({
        model: Board,
        initialize: function() {
	    registry.user.on('change:loc', function() {
		this.fetch({
		    success: _.bind(function(boards) {
			var ids = boards.map(function(board) {
			    return board.get('user')['id'];
			});
			registry.facebook.fetchUsers(ids, function(err, res) {
			    logger('err',err)
			    logger('res',res)
			});
		    }, this)
		});
	    }, this);
        },
        sync: sync
    });

    return Boards;
});