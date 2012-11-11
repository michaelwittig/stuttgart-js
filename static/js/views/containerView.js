define(['backbone', 'utils/registry', 'views/boardsListView', 'views/boardView'], function(Backbone, registry, BoardsListView , BoardView) {

    var ContainerView = Backbone.View.extend({

        el: '#container',

        initialize: function() {
            this.isHidden = true;
            this.boardsListView = new BoardsListView();
            this.boardView = new BoardView();

            registry.state.on('route:home', this.hide, this);

            registry.state.on('route:boards', function() {
                this.displayView('boardsListView');
            }, this);

            registry.state.on('route:boards', function() {
                this.displayView('boardView');
            }, this);
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
        },

        switchTo: function(view) {
            //TODO: animated switching between the two views
            //      move container left or right
        }
    });

    return ContainerView;
});