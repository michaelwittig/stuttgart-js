define(['backbone', 'hbs!templates/boardsListTemplate', 'utils/registry'], function(Backbone, template,registry) {

    var BoardListView = Backbone.View.extend({

    el: '#list-view',

    initialize: function() {
        //TODO: reduce the re-rendering of the list
        registry.boards.on('reset', this.render, this);
        registry.boards.loading.done(_.bind(this.render, this));
    },

    render: function() {
        logger('render')
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