define(['underscore', 'utils/socket', 'utils/registry'], function(_, socket, registry) {

    function sync(method, model, options) {
	var resp;

	switch(method) {
	case "read":
	    resp = model.id !== undefined ? find(model) : findAll();
	    break;
	case "create":
	    resp = create(model);
	    break;
	// case "update":  resp = update(model);                            break;
	// case "delete":  resp = destroy(model);                           break;
	}

	if(resp) {
	    options.success(resp);
	} else {
	    options.error("Record not found");
	}
    }


    function find(model) {}

    function findAll() {
	socket.emit('jsonrpc', {
	    method: 'message:getall',
	    params: [registry.user.get('loc'), 5],
	    id: _.uniqueId()
	}, function(err, data) {
	    logger('res:', data)
	});

	return [];
    }

    function create(model) {
	return model;
    }

    function update(model) {
	return model;
    }

    function destroy(model) {
	return model;
    }



    return sync;
});