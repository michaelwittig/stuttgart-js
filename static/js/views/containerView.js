define(['backbone', 'utils/registry', 'views/boardsListView', 'views/boardView', 'views/commentView'], function(Backbone, registry, BoardsListView , BoardView, CommentView) {

    var ContainerView = Backbone.View.extend({

        initialize: function() {
            this.isHidden = true;
            this.boardsListView = new BoardsListView();
	    this.boardView = new BoardView({commentView: new CommentView()});
        },

        displayView: function(view) {
            if (this.isHidden) {
                this.open(view);
                this.show();
            } else {
                this.switchTo(view);
            }
        },

        show: function() {
            //TODO: slide in from the bottom
            this.$el.show();
            this.isHidden = false;
        },

        hide: function() {
            //TODO: slide out to the bottom
            this.$el.hide();
            this.isHidden = true;
        },

        open: function(view) {
            //TODO: immediately show :view
            this.boardsListView.$el.hide();
            this.boardView.$el.hide();
            this[view].$el.show();
        },

        switchTo: function(view) {
            //TODO: animated switching between the two views
            //      move container left or right
            this.open(view);
        }
    });

    return ContainerView;
});