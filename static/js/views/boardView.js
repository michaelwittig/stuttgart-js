define(
    ['backbone', 'utils/registry', 'collections/messages', 'hbs!templates/boardTemplate', 'views/commentView'],
    function(Backbone, registry, Messages, boardTemplate, CommentView) {

    var BoardView = Backbone.View.extend({

    el: '#board-view',

    initialize: function() {
        this.messages = undefined;
        this.board = undefined;
        registry.state.on('route:board', this.load, this);
    },

    load: function(boardId) {

        registry.boards.loading.done(_.bind(function() {
            this.board = registry.boards.get(boardId);
            this.messages = new Messages(boardId);
            this.messages.loading.done(_.bind(function() {
                this.messages.on('reset', this.render, this);
                this.render();
            }, this));
        }, this));
	new CommentView({boardId: boardId});
    },

    render: function() {
        this.$el.html(boardTemplate({
            board: this.board.toJSON(),
            messages: this.messages.toJSON()
        }));
    },

    show: function() {
        logger('show board view');
        this.$el.show();
    },

    hide: function() {
        logger('hide board view');
        this.$el.hide();
    }
    });

    return BoardView;
});