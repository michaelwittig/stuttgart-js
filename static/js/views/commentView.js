define(['backbone', 'models/message'], function(Backbone, Message) {

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