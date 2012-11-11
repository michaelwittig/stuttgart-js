define(['underscore', 'backbone', 'utils/socket', 'utils/registry', 'common/logger'], function(_, Backbone, socket, registry, logger) {

    var DISTANCE = 5;

    var boardbackend = _.extend(Backbone.Events, {
	init: function() {
	    socket.on('update', function() {
		logger('boardbackend trigger update')
		this.trigger('update');
	    });
	},

	sync: function(method, model, options) {
	    switch(method) {
	    case "read":
		model.id !== undefined ? find(model, options) : findAll(options);
		break;
	    case "create":
		create(model);
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

    function create(model) {
	socket.emit('jsonrpc', {
	    jsonrpc: '2.0',
	    method: 'board:create',
	    id: _.uniqueId(),
	    params: [{
		title: model.get('title'),
		loc: model.get('loc')
	    }, {
		type: "facebook",
		value: registry.user.get('fbtoken')
	    }]
	}, function(err, data) {
	    logger('boardSysnc:create:cb', data);
	});
	return model;
    }

    function update(model) {
	return model;
    }

    function destroy(model) {
	return model;
    }



    return boardbackend;
});