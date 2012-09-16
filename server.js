var world = require('./world');

var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/static');
var shoe = require('shoe');
var Model = require('scuttlebutt/model');
var m = new Model;
world.forEach(function (obj, ix) {
    m.set(String(ix), obj);
});

var server = http.createServer(ecstatic);
server.listen(8070);

var sock = shoe(function (stream) {
    stream.pipe(m.createStream()).pipe(stream);
});
sock.install(server, '/shoe');
