/**
 * Location to room mapping.
 *
 * lng: [-180;180)
 * lat: [-90;90)
 *
 * 1km in long/lat 0.0090053796
 */
define([], function() {
	"use strict";

	function toRoom(x, y) {
		return "loc:" + x + "_" + y;
	}

	function round(f) {
		return Math.round(f * 25.0) / 25.0;
	}

	return {
		/**
		 *
		 * @param loc
		 * @param distance Distance in miles
		 * @return {Array}
		 */
		getRooms: function(loc, distance) {
			distance = distance * 1.609344 * 0.0090053796; // distance to km to lnglat
			var rooms = [];
			var xMin = round(loc.lng - distance);
			var xMax = round(loc.lng + distance);
			var yMin = round(loc.lat - distance);
			var yMax = round(loc.lat + distance);
			var x, y;
			for (x = xMin; x <= xMax; x = round(x + 0.04)) {
				for (y = yMin; y <= yMax;  y = round(y + 0.04)) {
					rooms.push(toRoom(x, y));
				}
			}
			return rooms;
		},
		getRoom: function(loc) {
			var x = round(loc.lng);
			var y = round(loc.lat);
			return toRoom(x, y);
		}
	};
});