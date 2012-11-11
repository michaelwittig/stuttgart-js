define(['backbone', 'utils/registry', 'collections/messages'], function(Backbone, registry, Messages) {

    var BoardView = Backbone.View.extend({

    el: '#board',

    initialize: function() {
	this.messages = undefined;
	registry.state.on('route:board', this.load, this);

    },

    load: function(boardId) {
	this.messages = new Messages(boardId);
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