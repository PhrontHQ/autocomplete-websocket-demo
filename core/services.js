var WebSocketClient = require("core/web-socket-client").WebSocketClient,
    Configuration = require("../configuration").Configuration;

function Services() {
    this.connect("ws://" + Configuration.SERVER_IP_ADDRESS + ":" + Configuration.SERVER_PORT);
}

Services._messageId = 0;
Services._callbacksHash = {};

Services.prototype.connect = function (url) {
    this._webSocketClient = new WebSocketClient(url);
}

Services.prototype._send = function (message, callback) {
    message.id = Services._messageId;
    Services._callbacksHash[message.id] = callback;
    Services._messageId++;
    this._webSocketClient.send(message, this._get);
}

Services.prototype._get = function (message) {
    if (message.error) {
        Services._callbacksHash[message.id](null, message.error);
    } else {
        Services._callbacksHash[message.id](message.response, null);
    }
    delete Services._callbacksHash[message.id];
}

Services.prototype.autocompleteTerm = function (string, callback) {
    this._send({
        module: "terms",
        command: "autocomplete",
        arguments: {
            term: string
        }
    }, callback);
}

Services.prototype.getTagsForQuery = function (term, tags, callback) {
    this._send({
        module: "tags",
        command: "retrieve",
        arguments: {
            term: term,
            tags: tags
        }
    }, callback);
}

Services.prototype.searchArticles = function (term, tags, callback) {
    this._send({
        module: "articles",
        command: "retrieve",
        arguments: {
            term: term,
            tags: tags
        }
    }, callback);
}

Services.prototype.getArticle = function (index, callback) {
    this._send({
        module: "articles",
        command: "retrieve",
        arguments: {
            index: index
        }
    }, callback);
}

exports.Services = new Services();