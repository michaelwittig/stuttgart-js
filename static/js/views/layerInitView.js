define(['backbone', 'common/logger'], function(Backbone, logger) {

    var LayerInitView = Backbone.View.extend({

        el: '#layer-init',

        show: function() {
            logger('show layer view');
            this.$el.parent().show();
            this.$el.show();
        },

        hide: function () {
            this.$el.parent().hide();
            this.$el.hide();
        }

    });

    return LayerInitView;

});