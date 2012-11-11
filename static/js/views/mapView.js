define(['backbone', 'underscore', 'jquery', 'leaflet', 'utils/registry', 'utils/geo', 'views/mapFooterView', 'common/logger'], function(Backbone, _, $, L, registry, geo, MapFooterView, logger) {

    var MapView = Backbone.View.extend({

        el: '#map-view',

        myLocationMarker: null,

        initialize: function() {
            this.map = L.map('map');
            this.mapFooterView = new MapFooterView();

            L.tileLayer(
	    'http://{s}.tile.cloudmade.com/b39618c7e2854b999658e0505efc4f0c/997/256/{z}/{x}/{y}.png',
            {maxZoom: 18}
            ).addTo(this.map);

            registry.user.on('change:loc', this.locate, this);

            this.map.on('click', _.bind(this.createBoard, this));
            this.map.on('popupclose', function() {
                registry.state.set('createloc', false);
            });
        },

        locate: function() {
            var loc = registry.user.get('loc');
            this.map.setView(loc, 13);
            if (this.myLocationMarker) {
                this.myLocationMarker.setLatLng(loc);
            } else {
                this.myLocationMarker = L.marker(loc).addTo(this.map);
            }
        },

        createBoard: function(e) {
            registry.state.set('createloc', e.latlng);
            registry.router.navigate('create', {trigger: true});

            geo.coordsToAddress(e.latlng.lat, e.latlng.lng, _.bind(function(err, data) {
                if (!err) {
                    L.popup()
                        .setLatLng(e.latlng)
                        .setContent('Create board here: <br/>' + data)
                        .openOn(this.map);
                }
            }, this));
        }
    });

    return MapView;
});