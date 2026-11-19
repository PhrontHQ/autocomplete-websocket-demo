var WebSocketClient = exports.WebSocketClient = function (url) {
    this._url = url;
    this._messageQueue = [];
    this._webSocket = null;
    this._isMessagePending = false;
    this._isReconnecting = false;
    this._reconnectionInterval = 100;
    this._connect();
}

WebSocketClient.prototype.send = function (message, callback) {
    this._messageQueue.push({
        message: message,
        callback: callback || function () {}
    });
    this._sendNextMessage();
}

WebSocketClient.prototype._sendNextMessage = function () {
    if (!this._isMessagePending && this._messageQueue.length) {
        if (this._webSocket) {
            this._isMessagePending = true;
            if ((this._webSocket.readyState !== WebSocket.CLOSING) && (this._webSocket.readyState !== WebSocket.CLOSED)) {
                try {
                    this._webSocket.send(JSON.stringify(this._messageQueue[0].message));
                } catch (e) {
                    this._isMessagePending = false;
                    this._reconnect();
                }
            } else {
                this._isMessagePending = false;
                this._reconnect();
            }
        } else {
            this._reconnect();
        }
    }
}

WebSocketClient.prototype._connect = function () {
    this._webSocket = new WebSocket(this._url);
    this._webSocket.addEventListener("error", this, false);
    this._webSocket.addEventListener("open", this, false);
}

WebSocketClient.prototype._reconnect = function () {
    var self;

    if (this._messageQueue.length && !this._isReconnecting) {
        self = this;
        this._webSocket = null;
        this._isMessagePending = false;
        this._isReconnecting = true;
        setTimeout(function () {
            self._connect();
            self._isReconnecting = false;
        }, Math.random() * this._reconnectionInterval);
        this._reconnectionInterval *= 2;
        if (this._reconnectionInterval > 30000) {
            this._reconnectionInterval = 30000;
        }
    }
}

WebSocketClient.prototype.handleEvent = function (event) {
    switch (event.type) {
        case "open":
            this._reconnectionInterval = 100;
            if (this._webSocket) {
                this._webSocket.addEventListener("message", this, false);
                this._webSocket.addEventListener("close", this, false);
            }
            this._sendNextMessage();
        break;
        case "message":
            this._isMessagePending = false;
            this._messageQueue.shift().callback(JSON.parse(event.data));
            this._sendNextMessage();
        break;
        default:
            this._reconnect();
    }
}