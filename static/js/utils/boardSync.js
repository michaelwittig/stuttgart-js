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
        return model;
    }


    function find(model) {}

    function findAll(options) {
        socket.emit('jsonrpc', {
            method: 'board:getall',
            params: [registry.user.get('loc'), 50],
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
            'jsonrpc': '2.0',
            'method': 'board:create',
            'params': [model.toJSON(), {
                type: "facebook",
                value: registry.user.get('fbtoken')
            }]
        }, function(err, data) {
            console.log(data);
        });
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