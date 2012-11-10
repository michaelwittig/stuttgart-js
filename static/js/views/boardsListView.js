define(['backbone'], function(Backbone, template) {

    var BoardListView = Backbone.View.extend({

    el: '#board-list',

    initialize: function() {
        this.render();
    },

    render: function() {
        this.$el.html(template())
    }
    });

    return BoardListView;
});