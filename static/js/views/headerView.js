define(['backbone', 'utils/registry', 'common/logger'], function(Backbone, registry, logger) {

    var HeaderView = Backbone.View.extend({

        el: '#header',

        events: {
            'click #facebook-login a': 'login'
        },

        initialize: function() {
            this.$facebookLogin = this.$('#facebook-login');
            registry.state.on('change:facebook', this.updateLogin, this);
            registry.state.on('route:boards', this.currentBoards, this);
            registry.state.on('route:board', this.currentBoards, this);
            registry.state.on('route:home', this.currentMap, this);
            registry.state.on('route:create', this.currentMap, this);
        },

        updateLogin: function(ev, state) {
            logger('fb state', state);
            if (registry.facebook.STATES.LOGGEDIN !== state) {
                this.$facebookLogin.show();
            } else {
                this.$facebookLogin.hide();
            }
        },

        login: function(ev) {
            ev.preventDefault();
            //alert('do login');
            registry.facebook.login();
        },

        currentBoards: function() {
            this.$('#home-button').removeClass('current');
            this.$('#boards-button').addClass('current');
        },

        currentMap: function() {
            this.$('#home-button').addClass('current');
            this.$('#boards-button').removeClass('current');
        }
    });

    return HeaderView;
});