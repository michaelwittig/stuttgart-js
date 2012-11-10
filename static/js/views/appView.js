define(
    ['backbone', 'views/headerView', 'views/containerView', 'views/footerView', 'utils/registry'],
    function (Backbone, HeaderView, ContainerView, FooterView, registry) {

    var AppView = Backbone.View.extend({

        el: 'body',

        initialize: function () {
            this.headerView = new HeaderView();
            this.containerView = new ContainerView();
            this.footerView = new FooterView();

            this.setPosition();
        },

        setPosition: function() {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition(function(pos) {
                registry.user.set('loc', {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
            }, function(msg) {
                registry.user.set('loc', {
                    lat: 51,
                    lng: -0.1
                });
            });
        }

    });

    return AppView;
});