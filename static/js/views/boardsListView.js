define(['backbone', 'hbs!templates/boardsListTemplate', 'utils/registry'], function(Backbone, template,registry) {

    var BoardListView = Backbone.View.extend({

    el: '#list-view',

    initialize: function() {
        //TODO: reduce the re-rendering of the list
        registry.boards.on('reset', this.render, this);
        registry.boards.loading.done(_.bind(this.render, this));
    },

    render: function() {
        this.$el.html(template(registry.boards.toJSON()));
    },

    events: {
        'click li': 'openBoard'
    },

    openBoard: function(e) {
        e.preventDefault();

        var boardId = $(e.currentTarget).attr('data-id');
        registry.router.navigate('board/' + boardId, {trigger: true});
    },

     show: function() {
         this.$el.show();
     },

     hide: function() {
        this.$el.hide();
     }

    });

    return BoardListView;
});