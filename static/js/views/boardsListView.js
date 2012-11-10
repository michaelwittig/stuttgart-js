define(['backbone', 'hbs!templates/boardsListTemplate', 'utils/registry'], function(Backbone, template,registry) {

    var BoardListView = Backbone.View.extend({

    el: '#board-list',

    initialize: function() {
        //TODO: reduce the re-rendering of the list
        registry.boards.on('change', this.render, this);
        registry.boards.on('reset', this.render, this);
        registry.boards.on('facebook:loaded', this.render, this);
    },

    render: function() {
        console.log('board list render',registry.boards.toJSON());
        this.$el.html(template(registry.boards.toJSON()));
    },

    show: function() {
        this.$el.show();
    },

    events: {
        'click li': 'openBoard'
    },

    openBoard: function(e) {
        var boardId = $(e.currentTarget).attr('data-id');
        registry.router.navigate('board/' + boardId);
    }
    });

    return BoardListView;
});