process.title = "Element Server";
console.log("Element Server starting...");

var WebSocketServer = require("ws").Server,
    Terms = require("./terms.js"),
    Tags = require("./tags.js"),
    Articles = require("./articles.js"),
    networkInterfaces = require('os').networkInterfaces(),
    express = require('express'),
    app = express(),
    path = require('path');
;

function init() {
    var ipAddresses = [],
        i, j;

    app.use(express.static(path.join(__dirname, '../')));
        var server = app.listen(8080, function () {
    });
    wss = new WebSocketServer({port: 8888});
    wss.on('connection', function(ws) {
        ws.on('message', function(message) {
            try {
                processMessage(JSON.parse(message), ws);
            } catch (e) {
                ws.send(JSON.stringify({error: "Messages must be JSON"}));
            }
        });
    });
    for (i in networkInterfaces) {
        for (j = 0; j < networkInterfaces[i].length; j++) {
            if (networkInterfaces[i][j].family === "IPv4" && !networkInterfaces[i][j].internal) {
                ipAddresses.push(networkInterfaces[i][j].address);
            }
        }
    }
    if (ipAddresses.length) {
        if (ipAddresses.length === 1) {
            console.log('Element Server will be accessible from the IP address "' + ipAddresses[0] + '"');
        } else {
            console.log('Element Server will be accessible from the following IP addresses:');
            for (i = 0; i < ipAddresses.length; i++) {
                console.log('"' + ipAddresses[i] + '"');
            }
        }
    }
}

function processMessage(message, ws) {
    var response = null,
        error = null,
        id = null;

    if (typeof message.id !== "undefined") {
        id = message.id;
        if (message.command && message.module) {
            switch (message.module) {
                case "terms":
                    switch (message.command) {
                        case "autocomplete":
                            if (message.arguments && typeof message.arguments.term !== "undefined") {
                                response = Terms.autocomplete(message.arguments.term);
                            } else {
                                error = "Arguments needed";
                            }
                        break;
                        default:
                            error = "Invalid command";
                        break;
                    }
                break;
                case "tags":
                    switch (message.command) {
                        case "retrieve":
                            if (message.arguments && typeof message.arguments.term !== "undefined") {
                                response = Tags.getTagsForQuery(
                                    message.arguments.term,
                                    message.arguments.tags
                                );
                                if (!response) {
                                    response = [];
                                }
                            } else {
                                error = "Arguments needed";
                            }
                        break;
                        default:
                            error = "Invalid command";
                        break;
                    }
                break;
                case "articles":
                    switch (message.command) {
                        case "retrieve":
                            if (message.arguments) {
                                if (message.arguments.index) {
                                    response = Articles.getArticle(message.arguments.index);
                                } else {
                                    if (message.arguments.term) {
                                        response = Articles.search(
                                            message.arguments.term,
                                            message.arguments.tags || [],
                                            message.arguments.limit || null
                                        );
                                    } else {
                                        error = "Arguments needed";
                                    }
                                }
                            } else {
                                error = "Arguments needed";
                            }
                        break;
                        default:
                            error = "Invalid command";
                        break;
                    }
                break;
                default:
                    error = "Invalid module";
                break;
            }
        } else {
            error = "Message missing command and/or module";
        }
    } else {
        error = "Message missing id";
    }
    if (error) {
        ws.send(JSON.stringify({id: id, error: error}));
    } else {
        if (response) {
            ws.send(JSON.stringify({id: id, response: response}));
        } else {
            ws.send(JSON.stringify({id: id, error: "error"}));
        }
    }
}

init();
