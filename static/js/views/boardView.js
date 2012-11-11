define(['backbone', 'utils/registry'], function(Backbone, registry) {

    var BoardView = Backbone.View.extend({

    el: '#board',

    initialize: function() {
	registry.state.on('route:board', this.load, this);
    },

    load: function(boardId) {
	logger('load board',boardId)
    },

    events: {
	'submit #comment': 'createMessage'
    },

    createMessage: function(e) {
	e.preventDefault();
	logger('create message')
    }
    });

    return BoardView;
});