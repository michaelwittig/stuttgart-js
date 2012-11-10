define(['backbone', 'leaflet', 'utils/registry', 'views/mapFooterView'], function(Backbone, L, registry, MapFooterView) {

    var MapView = Backbone.View.extend({

	el: '#map-view',

	initialize: function() {
	    this.map = L.map('map');
        this.mapFooterView = new MapFooterView();

	    L.tileLayer(
		'http://{s}.tile.cloudmade.com/56b3a5571a254061b9c6747f4a37bd75/997/256/{z}/{x}/{y}.png',
		{maxZoom: 18}
	    ).addTo(this.map);

        registry.user.on('change:loc', this.locate, this);

    },

    show: function() {
        this.$el.show();
    },

    locate: function() {
        logger('locate')
	    this.map.setView(registry.user.get('loc'), 13);
    }
    });

    return MapView;
});