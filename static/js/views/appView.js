define(
    ['backbone', 'views/headerView', 'views/containerView', 'views/mapView', 'utils/registry'],
    function (Backbone, HeaderView, ContainerView, MapView, registry) {

    var AppView = Backbone.View.extend({

        el: 'body',

        initialize: function () {
            this.headerView = new HeaderView();
            this.mapView = new MapView();
            this.containerView = new ContainerView();

            registry.user.setPosition();
        }
    });

    return AppView;
});