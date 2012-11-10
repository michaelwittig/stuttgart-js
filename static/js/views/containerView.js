define(['backbone', 'utils/registry', 'views/mapView', 'views/boardsListView'], function(Backbone, registry, MapView, BoardsListView) {

    var ContainerView = Backbone.View.extend({

	el: '#container',

	initialize: function() {
	    this.mapView = new MapView();
	    this.boardsListView = new BoardsListView();

	    registry.state.on('route:home', function() {
		this.mapView.show();
		// this.boardsListView.hide();
	      //this.boardView.hide();
	    }, this);

	    registry.state.on('route:boards', function() {
		this.boardsListView.show();
		// this.mapView.hide();
	      //this.boardView.hide();
	    }, this);

	}
    });

    return ContainerView;
});