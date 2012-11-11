define(['socket.io'], function(io) {
    var socket = io.connect('/');

    return socket;
});