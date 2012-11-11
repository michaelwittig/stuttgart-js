define(['utils/registry', 'underscore'], function(registry, _) {

    var ViewControl = function() {
        this.allViews =  {
            'mapView': registry.appView.mapView,
            'layerInitView': registry.appView.layerInitView,
            'layerVoteView': registry.appView.layerVoteView,
            'locationView': registry.appView.mapView.mapFooterView.locationView,
            'createBoardView': registry.appView.mapView.mapFooterView.createBoardView,
            'boardsListView': registry.appView.containerView.boardsListView,
            'boardView': registry.appView.containerView.boardView,
            'commentView': registry.appView.containerView.boardView.commentView
        };
    };

    ViewControl.prototype.hideAllViews = function() {
        _.each(this.allViews, function(view) {
            if (view && _.isFunction(view.hide)) {
                view.hide();
            }
        });
    };

    ViewControl.prototype.showViews = function(views) {
        var that = this;
        this.hideAllViews();
        _.each(views, function(view) {
            if (that.allViews[view] && _.isFunction(that.allViews[view].show)) {
                that.allViews[view].show();
            }
        });
    };

    return ViewControl;
});