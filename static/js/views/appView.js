define(
    ['backbone', 'views/headerView', 'views/containerView', 'views/footerView'],
    function (Backbone, HeaderView, ContainerView, FooterView) {

        var AppView = Backbone.View.extend({

	    el: 'body',

	    initialize: function () {
                this.headerView = new HeaderView();
                this.containerView = new ContainerView();
                this.footerView = new FooterView();
            }

        });

        return AppView;
});