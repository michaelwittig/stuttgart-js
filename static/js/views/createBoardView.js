define(['backbone', 'utils/registry', 'jquery', 'utils/socket', 'models/board', 'common/logger'], function(Backbone, registry, $, socket, Board, logger) {

    var CreateBoardView = Backbone.View.extend({

        el: '#sub-create',

        events: {
            'click #create-board': 'createBoard',
            'click #create-expire li a': 'updateExpire',
            'click .dragme': 'close'
        },

        initialize: function() {
            this.$form = this.$('#create-form');
            this.$notloggedin = this.$('#create-notloggedin');
            this.$textarea = this.$('textarea');
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
            $(ev.target).parent().addClass('current');
        },

        createBoard: function(ev) {
            var description = this.$textarea.val(),
                expires = this.$('#create-expire li.current').data('expires');

            ev.preventDefault();

            if (!description.length) {
                return false;
            }

            var board = new Board({
                title: description,
                loc: registry.state.get('createloc') || registry.user.get('loc'),
                expirationDate: expires
            }).save(null, {
                success: function() {
                    logger('new board created');
                    registry.router.navigate('home', {trigger:true});
                    registry.state.trigger('closepopups');
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