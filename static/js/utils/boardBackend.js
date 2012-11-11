define(['underscore', 'backbone', 'utils/socket', 'utils/registry', 'common/logger'], function(_, Backbone, socket, registry, logger) {

    var DISTANCE = 1;

    var boardBackend = _.extend(Backbone.Events, {
        init: function() {

            socket.on('update', _.bind(function() {
                logger('boardbackend trigger update')
                this.trigger('update');
            },this));
        },

        sync: function(method, model, options) {
            switch(method) {
            case "read":
                model.id !== undefined ? find(model, options) : findAll(options);
                break;
            case "create":
                create(model, options);
                break;
            // case "update":  resp = update(model);                            break;
            // case "delete":  resp = destroy(model);                           break;
            }
            return model;
        }
    });


    function find(model) {}

    function findAll(options) {
        socket.emit('jsonrpc', {
            method: 'board:getall',
            params: [registry.user.get('loc'), DISTANCE],
            id: _.uniqueId()
        }, function(err, data) {
            if (err) {
		logger('boards:getall', err)
                options.error(err.message);
            } else {
		logger('boards:getall success', data.result)
		options.success(data.result);
            }
        });

        return [];
    }

    function create(model, options) {
	logger('loc',model.get('loc'))
        socket.emit('jsonrpc', {
            jsonrpc: '2.0',
            method: 'board:create',
            id: _.uniqueId(),
            params: [{
                title: model.get('title'),
                loc: model.get('loc'),
                expireIn: model.get('expireIn')
            }, {
                type: "facebook",
                value: registry.user.get('fbtoken')
            }]
        }, function(err, data) {
            logger('boardSysnc:create:cb', data);
            if (!err && !data.error) {
                options.success && options.success(data);
            } else {
                options.error && options.error(err);
            }
        });
        return model;
    }

    function update(model) {
        return model;
    }

    function destroy(model) {
        return model;
    }

    boardBackend.init();

    return boardBackend;
});