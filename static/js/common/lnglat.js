define([], function() {
	"use strict";

	var R = 6371; // radius of the earth in km

	function toRad(value) {
		return value * Math.PI / 180;
	}

	return {
		distance: function(loc1, loc2) {
			var dLat = toRad(loc2.lat-loc1.lat);
			var dLon = toRad(loc2.lng-loc1.lng);
			var lat1 = toRad(loc1.lat);
			var lat2 = toRad(loc2.lat);
			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
			var d = R * c; // in km
			return d * 0.621371192; // in miles
		}
	}
})