define(['backbone', 'underscore', 'jquery', 'leaflet', 'utils/registry', 'utils/geo', 'views/mapFooterView', 'common/logger'], function(Backbone, _, $, L, registry, geo, MapFooterView, logger) {

    var MapView = Backbone.View.extend({

        el: '#map-view',

        myLocationMarker: null,

        boardMarkers: [],

        initialize: function() {
	    this.map = L.map('map', {
		zoomControl: false,
		attributionControl: false
	    });
            this.mapFooterView = new MapFooterView();

            L.tileLayer(
	    'http://{s}.tile.cloudmade.com/b39618c7e2854b999658e0505efc4f0c/997/256/{z}/{x}/{y}.png',
	    {maxZoom: 18, detectRetina:true}
            ).addTo(this.map);

            registry.user.on('change:loc', this.locate, this);
            registry.user.on('locate:me', this.locate, this);

            this.map.on('click', _.bind(this.createBoard, this));
            this.map.on('popupclose', function() {
                registry.state.set('createloc', false);
                registry.router.navigate('home', {trigger: true});
            });

            registry.state.on('closepopups', _.bind(function() {
                logger('close popup');
                this.map.closePopup();
            }, this));

            registry.boards.on('reset', this.updateBoardMarkers, this);
            $(window).on('resize', this.updateMapSize);

            registry.state.on('route:boards', this.hide, this);
            registry.state.on('route:board', this.hide, this);
            registry.state.on('route:home', this.show, this);
            registry.state.on('route:home', this.show, this);

            this.updateMapSize();
        },

        locate: function() {
            logger('locate')
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
        },

        updateBoardMarkers: function() {
            var that = this;
            _.each(this.boardMarkers, function(marker) {
                that.map.removeLayer(marker);
            });
            this.boardMarkers.length = 0;
            registry.boards.each(function(board) {
                var marker = L.marker(board.get('loc'));
                marker.on('click', function() {
                  registry.router.navigate('board/'+board.get('_id'), {trigger:true});
                });
                marker.addTo(that.map);
                that.boardMarkers.push(marker);
            });
        },

        updateMapSize: function() {
            var mapHeight = ($(window).height()-$('#header').height()-$('#footer').height())+100;
            $('#content,#map').css('height',mapHeight);
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