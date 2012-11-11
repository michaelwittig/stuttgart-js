define(['backbone', 'common/logger'], function(Backbone, logger) {

    var LayerVoteView = Backbone.View.extend({

        el: '#layer-vote',

        show: function() {
            this.$el.parent().show();
            this.$el.show();
        },

        hide: function () {
            this.$el.parent().hide();
            this.$el.hide();
	},

	events: {
	    'click #close-layer-vote': 'openLastView'
	},

	openLastView: function(e) {
	    e.preventDefault();
	    window.history.back();
	}

    });

    return LayerVoteView;

});