define(['backbone', 'underscore', 'leaflet', 'utils/registry', 'views/mapFooterView', 'common/logger'], function(Backbone, _, L, registry, MapFooterView, logger) {

    var MapView = Backbone.View.extend({

        el: '#map-view',

        myLocationMarker: null,

        initialize: function() {
            this.map = L.map('map');
            this.mapFooterView = new MapFooterView();

            L.tileLayer(
            'http://{s}.tile.cloudmade.com/56b3a5571a254061b9c6747f4a37bd75/997/256/{z}/{x}/{y}.png',
            {maxZoom: 18}
            ).addTo(this.map);

            registry.user.on('change:loc', this.locate, this);

            this.map.on('click', _.bind(this.createBoard, this));

        },

        show: function() {
            this.$el.show();
        },

        locate: function() {
            var loc = registry.user.get('loc');
            this.map.setView(loc, 13);
            if (this.myLocationMarker) {
                this.myLocationMarker.setLatLng(new L.LatLng(loc.lat, loc.lng));
            } else {
                this.myLocationMarker = L.marker([loc.lat, loc.lng]).addTo(this.map);
            }
        },

        createBoard: function(e) {
            registry.router.navigate('create/' + e.latlng.lat + '/' + e.latlng.lng, {trigger: true, replace: false});
        }
    });

    return MapView;
});