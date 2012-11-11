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
	    'click #comment-submit': 'createMessage',
		'change #comment-input': 'updateCount',
		'keyup #comment-input': 'updateCount'
	},

	updateCount: function() {
		logger("input length", this.$input.val().length);
		var cnt = 140 - this.$input.val().length;
		if (cnt <= 0) {
			cnt = 0;
			// TODO make count red?
			this.$input.val(this.$input.val().substring(0, 140));
		} else if(cnt <= 10) {
			// TODO make count yellow?
		} else {
			// TODO remove color?
		}
		//this.$textareaCnt.html('' + cnt); // TODO show cnt
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
		}, this)
	    });
	}
    });


    return CommentView;
});