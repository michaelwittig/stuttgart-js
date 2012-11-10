define(['backbone', 'leaflet'], function(Backbone, L) {

    var MapView = Backbone.View.extend({

	el: '#map',

	initialize: function() {
	    this.map = L.map(this.$el[0]);

	    L.tileLayer(
		'http://{s}.tile.cloudmade.com/56b3a5571a254061b9c6747f4a37bd75/997/256/{z}/{x}/{y}.png',
		{maxZoom: 18}
	    ).addTo(this.map);

	    this.map.setView([51.505, -0.09], 13);
	},

	show: function() {

	}
    });

    return MapView;
});