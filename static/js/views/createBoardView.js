define(['backbone'], function(Backbone) {

    var CreateBoardView = Backbone.View.extend({

        el: '#create-view',

        initialize: function() {

        },

        show: function() {
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        }
    });

    return CreateBoardView;

});