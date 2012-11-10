define(['backbone', 'utils/registry', 'jquery', 'utils/socket'], function(Backbone, registry, $, socket) {

    var CreateBoardView = Backbone.View.extend({

        el: '#create-view',

        events: {
            'click #create-board': 'createBoard',
            'click #create-expire li': 'updateExpire'
        },

        initialize: function() {
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
                this.$('#create-form').show();
                this.$('#create-notloggedin').hide();
            } else {
                this.$('#create-form').hide();
                this.$('#create-notloggedin').show();
            }
        },

        updateExpire: function(ev) {
            this.$('#create-expire li').removeClass('current');
            $(ev.target).addClass('current');
        },

        createBoard: function(ev) {
            var description = this.$('#board-description').val(),
                expires = this.$('#create-expire li.current').data('expires');

            ev.preventDefault();

            if (!this.$('#board-description').val().length) {
                return false;
            }

            socket.emit('jsonrpc', {
                'jsonrpc': '2.0',
                'method': 'board:create',
                'params': [{
                        'title': description,
                        'loc': registry.user.get('loc')
                    }, {
                        type: "facebook",
                        value: registry.user.get('fbtoken')
                    }
                ]
            }, function(err, data) {
                console.log(data);
            });

            return true;
        }
    });

    return CreateBoardView;

});