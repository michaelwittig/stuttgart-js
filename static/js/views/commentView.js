define(['backbone', 'models/message', 'utils/registry'], function(Backbone, Message, registry) {

    var CommentView = Backbone.View.extend({

	el: '#sub-comment',

	initialize: function() {
	    this.boardId = undefined;
	    this.$input = this.$('#comment-input');
	},

	load: function(boardId) {
	    this.boardId = boardId;
	},

	show: function() {
	    this.$el.show();
	},

	hide: function() {
	    this.$el.hide();
	},

	events: {
	    'submit #comment-form': 'createMessage',
	    'click #comment-submit': 'createMessage'
	},

	createMessage: function(e) {
	    e.preventDefault();

	    var comment = this.$input.val();

	    if(!comment.length) {
		return;
	    }

	    new Message({
		title: comment,
		boardId: this.boardId
	    }).save(null, {
            success: _.bind(function() {
                this.$input.val('');
                registry.state.trigger('notice', 'Message has been added');
            }, this),
            error: function() {
                registry.state.trigger('notice', 'Adding the Message failed');
            }
	    });
	}
    });


    return CommentView;
});