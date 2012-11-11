define(
    ['backbone', 'views/headerView', 'views/layerInitView', 'views/layerVoteView', 'views/containerView', 'views/mapView', 'utils/registry', 'utils/style'],
    function (Backbone, HeaderView, LayerInitView, LayerVoteView, ContainerView, MapView, registry) {

    var AppView = Backbone.View.extend({

        el: 'body',

        initialize: function () {
            this.headerView = new HeaderView();
            this.mapView = new MapView();
            this.containerView = new ContainerView();
            this.layerInitView = new LayerInitView();
            this.layerVoteView = new LayerVoteView();
        }
    });

    return AppView;
});