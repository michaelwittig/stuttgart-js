define(['underscore', 'common/logger', 'utils/registry'], function (_, logger, registry) {

    var Facebook = function () {
        var that = this;

        this.setState(this.STATES.NOTREADY);
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '218338891631183',
                /*channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html',*/ // Channel File for x-domain communication
                status     : true,
                cookie     : true,
                xfbml      : true
            });

            that.init(FB);
        };

        (function(d, debug){
            var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement('script'); js.id = id; js.async = true;
            js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
            ref.parentNode.insertBefore(js, ref);
        }(document, /*debug*/ false));
    };

    Facebook.prototype.STATES = {
        'NOTREADY': 0,
        'INITIALIZED': 1,
        'LOGGEDIN': 2
    };

    Facebook.prototype.init = function (fb) {
        this.fb = fb;
        this.setState(this.STATES.INITIALIZED);
        this.fb.Event.subscribe('auth.statusChange', _.bind(this.onStatusChange, this));
    };

    Facebook.prototype.onStatusChange = function (response) {
        if (response.status === 'connected') {
            registry.user.set('fbtoken', response.authResponse.accessToken);
            registry.user.set('fbid', response.authResponse.userID);
            this.token = response.authResponse.accessToken;
            this.setState(this.STATES.LOGGEDIN);
        } else {
            this.setState(this.STATES.INITIALIZED);
        }
    };

    Facebook.prototype.setState = function (state) {
        this.state = state;
        registry.state.set('facebook', state);
    };

    Facebook.prototype.fetchUsers = function (userIds, cb) {
        if (this.state === this.STATES.NOTREADY) {
            return false;
        }

        var qryIds = [];
        _.each(userIds, function(val) {
            qryIds.push('uid=' + val);
        });

        this.fb.api({
            method: 'fql.query',
            query: 'SELECT uid, name, pic_square FROM user WHERE ' + qryIds.join(' OR ')
        }, function (response) {
            if (!response.error_msg) {
                cb(null, response);
            } else {
                cb(new Error(response.error_msg))
            }
        });

        return true;
    };

    Facebook.prototype.login = function () {
        this.fb.login();
    };

    return Facebook;
});