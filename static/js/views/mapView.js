define(['backbone', 'underscore', 'jquery', 'leaflet', 'utils/registry', 'utils/geo', 'views/mapFooterView', 'common/logger'], function(Backbone, _, $, L, registry, geo, MapFooterView, logger) {

    var MapView = Backbone.View.extend({

        el: '#map-view',

        myLocationMarker: null,

        boardMarkers: [],

        initialize: function() {
            this.map = L.map('map', {
                zoomControl: false,
                attributionControl: false,
				dragging: false
			});
            this.mapFooterView = new MapFooterView();

            L.tileLayer(
	    'http://{s}.tile.cloudmade.com/b39618c7e2854b999658e0505efc4f0c/997/256/{z}/{x}/{y}.png',
	    {minZoom: 15, maxZoom: 17, detectRetina:true}
            ).addTo(this.map);

            registry.user.on('change:loc', this.locate, this);
            registry.user.on('locate:me', this.locate, this);

            this.map.on('click', _.bind(this.createBoard, this));

            registry.boards.on('reset', this.updateBoardMarkers, this);
        },

        locate: function() {
            var loc = registry.user.get('loc');
            this.map.setView(loc, 13);
            if (this.myLocationMarker) {
                this.myLocationMarker.setLatLng(loc);
            } else {
                this.myLocationMarker = L.marker(loc, {
                    icon: L.icon({
                        iconUrl: 'img/marker-position.png',
                        iconSize: [27, 37],
                        iconAnchor: [22, 94],
                        popupAnchor: [-3, -76],
                        shadowUrl: 'img/marker-shadow.png',
                        shadowSize: [31, 31],
                        shadowAnchor: [22, 94]
                    })
                }).addTo(this.map);
            }
        },

        createBoard: function(e) {
            registry.state.set('createloc', e.latlng);
            registry.router.navigate('create', {trigger: true});

	    L.marker(e.latlang, {
		icon: L.icon({
		    iconUrl: 'img/icon-marker-create.png',
		    iconSize: [27, 37],
		    iconAnchor: [22, 94],
		    popupAnchor: [-3, -76],
		    shadowUrl: 'img/marker-shadow.png',
		    shadowSize: [31, 31],
		    shadowAnchor: [22, 94]
		})
	    }).addTo(this.map);
        },

        updateBoardMarkers: function() {
            var that = this;
            _.each(this.boardMarkers, function(marker) {
                that.map.removeLayer(marker);
            });
            this.boardMarkers.length = 0;
            registry.boards.each(function(board) {
                var marker = L.marker(board.get('loc'), {
                    icon: L.icon({
                        iconUrl: 'img/marker-event.png',
                        iconSize: [27, 37],
                        iconAnchor: [22, 94],
                        popupAnchor: [-3, -76],
                        shadowUrl: 'img/marker-shadow.png',
                        shadowSize: [31, 31],
                        shadowAnchor: [22, 94]
                    })}
                );
                marker.on('click', function() {
                  registry.router.navigate('board/'+board.get('_id'), {trigger:true});
                });
                marker.addTo(that.map);
                that.boardMarkers.push(marker);
            });
        },

        hide: function() {
            this.$el.hide();
        },

        show: function() {
            this.$el.show();
            this.map.invalidateSize(true)
        }

    });

    return MapView;
});