define(['backbone'], function(Backbone) {

    var CommentView = Backbone.View.extend({

	el: '#sub-comment',

	initialize: function(boardId) {
	    this.boardId = boardId;
	    this.$input = this.$('#comment-input');
	},

	events: {
	    'submit #comment-form': 'createMessage',
	    'click #comment-submit': 'createMessage'
	},

	createMessage: function(e) {
	    e.preventDefault();

	    logger('create message')
	    var comment = this.$input.val();

	    if (!comment.length) {
		return;
	    }

	    new Message({
		title: comment,
		boardId: this.boardId
	    }).save();
	}
    });


    return CommentView;
});