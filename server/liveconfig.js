#!/usr/bin/env node

var express = require('express');
var app = express();
require('express-ws')(app);

var connections = [];

app.get('/', function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Nothing to see here move along...");
});

app.param('uuid', function (req, res, next, uuid) {
    req.uuid = uuid || null;
    return next();
});

app.param('watchtoken', function (req, res, next, watchtoken) {
    req.watchtoken = watchtoken || null;
    return next();
});

function addConnection(data) {
    var index = -1;

    for(var i = 0; i < connections.length; i++) {
        if (connections[i].uuid == data.uuid && connections[i].watchtoken == data.watchtoken) {
            Object.assign(connections[i], data);
            index = i;
            break;
        }
    }
    if (index === -1) {
        connections.push(data);
        index = connections.length-1;
    }
    return connections[index];
}

app.ws('/forward/:uuid/:watchtoken', function (ws, req) {

    if (req.params.uuid == null || req.params.watchtoken == null) {
        ws.close();
        return;
    }

    console.log("Config has connected! UUID: " + req.params.uuid + " Watchtoken: " + req.params.watchtoken);

    addConnection({
        uuid: req.params.uuid,
        watchtoken: req.params.watchtoken,
        config: ws,
        queue: []
    });

    ws.on('message', function (msg) {
        connections.forEach(function(item) {
            if (item.uuid == req.params.uuid  && item.watchtoken == req.params.watchtoken) {
                if (item.pebble) {
                    console.log('Message forwarded to UUID: ' + item.uuid + ' watchtoken: ' + item.watchtoken);
                    item.pebble.send(msg);
                } else {
                    console.log('Queuing message for UUID: ' + item.uuid + ' watchtoken: ' + item.watchtoken);
                    item.queue.push(msg);
                }
            }
        });
    });

    ws.on('close', function () {
        connections.forEach(function(item, index) {
            if (item.uuid == req.params.uuid  && item.watchtoken == req.params.watchtoken) {
                var pebble = item.pebble;
                connections.splice(index, 1);
                if (pebble) {
                    console.log("Closing connection to Pebble " + item.uuid + " " + item.watchtoken);
                    pebble.close();
                }
            }
        });
    });

});

app.ws('/receive/:uuid/:watchtoken', function (ws, req) {

    if (req.params.uuid == null || req.params.watchtoken == null) {
        ws.close();
        return;
    }

    console.log("Pebble has connected! UUID: " + req.params.uuid + " Watchtoken: " + req.params.watchtoken);

    var connection = addConnection({
        uuid: req.params.uuid,
        watchtoken: req.params.watchtoken,
        pebble: ws
    });

    if (connection.queue && connection.queue.length > 0) {
        console.log('Emptying queue!');
        connection.queue.forEach(function(msg) {
           ws.send(msg);
        });
        delete connection.queue;
    }

    ws.on('close', function () {
        connections.forEach(function(item, index) {
            if (item.uuid == req.params.uuid  && item.watchtoken == req.params.watchtoken) {
                var config = item.config;
                connections.splice(index, 1);
                if (config) {
                    console.log("Closing connection to Config " + item.uuid + " " + item.watchtoken);
                    config.close();
                }
            }
        });
    });

});

app.listen(8080);
console.log("Liveconfig is listening on port 8080");