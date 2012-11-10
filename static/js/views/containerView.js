define(['backbone', 'utils/registry', 'views/mapView'], function(Backbone, registry, MapView) {

    var ContainerView = Backbone.View.extend({

    el: '#container',

    initialize: function() {
	this.mapView = new MapView();

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