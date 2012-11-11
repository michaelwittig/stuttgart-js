define(['backbone', 'common/logger', 'utils/registry'], function(Backbone, logger, registry) {

    var NotificationView = Backbone.View.extend({

        el: '#notification',

        initialize: function() {
            registry.state.on('notice', this.showNotice, this);
            registry.state.on('error', this.showError, this);
        },

        showNotice: function(msg) {
            this.$el.removeClass('red');
            this.$el.addClass('green');
            this.$el.html(msg);
            this.$el.fadeIn();
            setTimeout(_.bind(function() {
                this.$el.fadeOut();
            }, this), 4000);
        },

        showError: function (msg) {
            this.$el.removeClass('green');
            this.$el.addClass('red');
            this.$el.html(msg);
            this.$el.fadeIn();
            setTimeout(_.bind(function() {
                this.$el.fadeOut();
            }, this), 4000);
        }

    });

    return NotificationView;
});