define(['backbone', 'utils/registry', 'common/logger'], function(Backbone, registry, logger) {

    var HeaderView = Backbone.View.extend({

        el: '#header',

        events: {
            'click #facebook-login a': 'login'
        },

        initialize: function() {
            this.$facebookLogin = this.$('#facebook-login');
            registry.state.on('change:facebook', this.updateLogin, this);
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
        }
    });

    return HeaderView;
});