define(['common/logger', 'jquery'], function (logger, $) {

    var Geo = function() {};

    Geo.prototype.coordsToAddress = function (lat, lng, cb) {
	var geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(lat, lng);
	geocoder.geocode({'latLng': latlng}, function(results) {
	    if (results.length) {
		cb(null, results[0].formatted_address);
	    } else {
		cb(new Error('Location not found'), []);
	    }
	});
    };

    Geo.prototype.addressToCoords = function (address, cb) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({address: address}, function(results) {
	    if (results.length) {
		cb(null, results[0].geometry.location.Za, results[0].geometry.location.$a);
	    } else {
		cb(new Error('Location not found'), null, null);
	    }
	});
    };

    return new Geo();
});