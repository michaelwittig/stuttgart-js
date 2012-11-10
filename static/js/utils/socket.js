define(['socket.io'], function(io) {
    var socket = io.connect('http://localhost');

    return socket;
});