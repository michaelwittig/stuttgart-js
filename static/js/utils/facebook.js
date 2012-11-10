define(['underscore', 'common/logger', 'models/appState'], function (_, log, appState) {

    var Facebook = function () {
        this.setState(this.STATES.NOTREADY);
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

    Facebook.prototype.onStatusChange = function () {
        log.notice('facebook status update');
    };

    Facebook.prototype.setState = function (state) {
        this.state = state;
        appState.set('facebook', state);
    };

    Facebook.prototype.getUsers = function (userIds) {
        if (this.state === this.STATES.NOTREADY) {
            return false;
        }

        log.notice('get users');
        return [];
    };

    Facebook.prototype.login = function () {
        log.notice('do login');
    };

    return Facebook;
});