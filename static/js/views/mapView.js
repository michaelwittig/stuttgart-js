define(['backbone', 'underscore', 'jquery', 'leaflet', 'utils/registry', 'utils/geo', 'views/mapFooterView', 'common/logger'], function(Backbone, _, $, L, registry, geo, MapFooterView, logger) {

    var MapView = Backbone.View.extend({

        el: '#map-view',

        myLocationMarker: null,

        boardMarkers: [],

	iconDefaults: {
	    iconSize: [27, 37],
	    // shadowUrl: 'img/marker-shadow.png',
	    // shadowSize: [31, 31],
	    iconAnchor: [12, 37],
	    // popupAnchor: [-3, -76]
	    // shadowAnchor: [22, 94]
	},

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
            $(window).on('resize', _.bind(this.windowResize, this));
            this.windowResize();

            registry.boards.on('reset', this.updateBoardMarkers, this);

	    registry.state.on('closepopups', function() {
		if (this.myMarker) {
		    this.map.removeLayer(this.myMarker);
		    delete this.myMarker;
		}
	    }, this);
        },

        locate: function() {
            var loc = registry.user.get('loc');
            this.map.setView(loc, 13);
            if (this.myLocationMarker) {
                this.myLocationMarker.setLatLng(loc);
            } else {
                this.myLocationMarker = L.marker(loc, {
		    icon: L.icon(_.extend(this.iconDefaults, {
			iconUrl: 'img/marker-position.png'
		    }))
                }).addTo(this.map);
            }
        },

        createBoard: function(e) {

            if (registry.state.get('facebook') !== registry.facebook.STATES.LOGGEDIN) {
                registry.state.trigger('error', 'Login to create a board');
                return;
            }

            registry.state.set('createloc', e.latlng);
            registry.router.navigate('create', {trigger: true});

	    if (this.myMarker) {
		this.myMarker.setLatLng(e.latlng);
	    } else {
		this.myMarker = L.marker(e.latlng, {
		    icon: L.icon(_.extend(this.iconDefaults, {
			iconUrl: 'img/icon-marker-create.png'
		    }))
		}).addTo(this.map);
	    }
        },

        updateBoardMarkers: function() {
            var that = this;
            _.each(this.boardMarkers, function(marker) {
                that.map.removeLayer(marker);
            });
            this.boardMarkers.length = 0;
            registry.boards.each(function(board) {
                var marker = L.marker(board.get('loc'), {
		    icon: L.icon(_.extend(this.iconDefaults, {
			iconUrl: 'img/marker-event.png'
		    }))}
                );
                marker.on('click', function() {
                  registry.router.navigate('board/'+board.get('_id'), {trigger:true});
                });
                marker.addTo(that.map);
                that.boardMarkers.push(marker);
	    }, this);
        },

        hide: function() {
            this.$el.hide();
        },

        show: function() {
            this.$el.show();
            this.map.invalidateSize(true);
        },

        windowResize: function() {
            var mapHeight = ($(window).height()-$('#header').height()-$('#footer').height())+100;
            if (registry.state.get('route') !== 'board' && registry.state.get('route') !== 'boards') {
                $('#content,#map').css('height',mapHeight);
            }
        }


    });

    return MapView;
});