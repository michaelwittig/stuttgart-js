define(['backbone', 'utils/boardSync'], function(Backbone, sync) {

    var Board = Backbone.Model.extend({

	idAttribute: '_id',

	defaults: {
	    title: '',
	    loc: {
		lat: 0,
		lng: 0
	    },
	    distance: 0,
	    photo: '',
	    creator: ''
	    //expirationDate
	},

	sync: sync,

	initialize: function() {

	}

    });

    return Board;
});