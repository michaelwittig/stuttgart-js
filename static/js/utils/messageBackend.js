define(['underscore', 'backbone', 'utils/socket', 'utils/registry'], function(_, Backbone, socket, registry) {

    var DISTANCE = 5;

    var messageBackend = _.extend(Backbone.Events, {
	listen: function() {
	    socket.on('update', _.bind(function() {
		logger('messageBackend trigger update')
		this.trigger('update');
	    }, this));
	},

	sync: function(method, model, options) {
	    switch(method) {
	    case "read":
		model.id !== undefined ? find(model, options) : findAll(model, options);
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

    function findAll(model, options) {
	socket.emit('jsonrpc', {
	    method: 'message:getall',
	    params: [model.boardId],
	    id: _.uniqueId()
	}, function(err, data) {
	    if(err) {
		logger('message:getall err', err)
		options.error(err.message);
	    } else {
		logger('message:getall success', data.result)
		options.success(data.result);
	    }
	});

	return [];
    }

    function create(model) {
	socket.emit('jsonrpc', {
	    jsonrpc: '2.0',
	    method: 'message:create',
	    id: _.uniqueId(),
	    params: [
		model.get('boardId'),
		model.get('title'),
		{
		    type: "facebook",
		    value: registry.user.get('fbtoken')
		}
	    ]
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

    messageBackend.listen()

    return messageBackend;
});