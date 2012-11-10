define(['underscore', 'utils/socket', 'utils/registry'], function(_, socket, registry) {

    function sync(method, model, options) {
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
    }


    function find(model) {}

    function findAll(options) {
        logger('loc', registry.user.get('loc'))
        socket.emit('jsonrpc', {
            method: 'board:getall',
            params: [registry.user.get('loc'), 50],
            id: _.uniqueId()
        }, function(err, data) {
            if (err) {
		logger('err', err)
                options.error(err.message);
            } else {
                logger('res', data)
                options.success(data.results);
            }
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