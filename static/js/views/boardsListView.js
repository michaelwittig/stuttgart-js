define(['backbone', 'hbs!templates/boardsListTemplate', 'utils/registry'], function(Backbone, template,registry) {

    var BoardListView = Backbone.View.extend({

    el: '#board-list',

    initialize: function() {
	registry.boards.on('change', this.render, this);
        this.render();
    },

    render: function() {
	logger('board list render');
	this.$el.html(template(registry.boards.toJSON()));
    }
    });

    return BoardListView;
});