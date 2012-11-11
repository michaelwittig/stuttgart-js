define(['backbone', 'utils/registry', 'jquery', 'utils/socket', 'models/board', 'common/logger'], function(Backbone, registry, $, socket, Board, logger) {

    var CreateBoardView = Backbone.View.extend({

        el: '#sub-create',

        events: {
            'click #create-board': 'createBoard',
	    	'click #create-expire li': 'updateExpire',
            'click .dragme': 'close',
			'change #create-board-title': 'updateCount',
			'keyup #create-board-title': 'updateCount'
        },

        initialize: function() {
            this.$form = this.$('#create-form');
            this.$notloggedin = this.$('#create-notloggedin');
            this.$textarea = this.$('#create-board-title');
			this.$textareaCnt = this.$('#create-board-title-cnt');
            registry.state.on('change:facebook', this.updateLoginState, this);
        },

        show: function() {
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        },

        updateLoginState: function(ev, val) {
            if (registry.facebook.STATES.LOGGEDIN === val) {
                this.$form.show();
                this.$notloggedin.hide();
            } else {
                this.$form.hide();
                this.$notloggedin.show();
            }
        },

        updateExpire: function(ev) {
            ev.preventDefault();
            this.$('#create-expire li').removeClass('current');
			$(ev.currentTarget).addClass('current');
        },

		updateCount: function(ev) {
			var cnt = 140 - this.$textarea.val().length;
			if (cnt <= 0) {
				cnt = 0;
				this.$textarea.removeClass();
				this.$textarea.addClass("count count-red");
				this.$textarea.val(this.$textarea.val().substring(0, 140));
			} else if(cnt <= 10) {
				this.$textarea.removeClass();
				this.$textarea.addClass("count count-yellow");
			} else {
				this.$textarea.removeClass();
				this.$textarea.addClass("count");
			}
			this.$textareaCnt.html('' + cnt);
		},

        createBoard: function(ev) {
            var $textarea = this.$textarea;
			var $textareaCnt = this.$textareaCnt;
            var description = this.$textarea.val(),
                expires = this.$('#create-expire li.current').data('expires');

            ev.preventDefault();

            if (!description.length) {
                return false;
            }

            var board = new Board({
                title: description,
                loc: registry.state.get('createloc') || registry.user.get('loc'),
                expireIn: expires
            }).save(null, {
                success: function() {
                    registry.state.trigger('notice', 'Your board is ready to use.');
                    registry.router.navigate('home', {trigger:true});
                    registry.state.trigger('closepopups');
                    $textarea.val('');
					$textareaCnt.html('140');
                },
                error: function(err) {
                    logger('new board created error', err);
                }
            });

            return true;
        },

        close: function() {
            registry.router.navigate('home', {trigger:true});
            registry.state.trigger('closepopups');
        }
    });

    return CreateBoardView;

});