"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextMessage_1 = require("./Messages/TextMessage");
var Listener_1 = require("./Listener");
var Proxy = /** @class */ (function () {
    function Proxy(alias, ws) {
        var _this = this;
        this.alias = alias;
        this.ws = ws;
        this.listeners = new Array();
        this.IsConnected = false;
        this.On("___error", function (err) {
            _this.OnError(err);
        });
    }
    Proxy.prototype.OnError = function (event) { };
    Proxy.prototype.OnOpen = function (event) { };
    Proxy.prototype.OnClose = function (event) { };
    Proxy.prototype.Connect = function () {
        this.ws.send(new TextMessage_1.TextMessage("___connect", {}, this.alias).toString());
        return this;
    };
    ;
    Proxy.prototype.Close = function () {
        this.ws.send(new TextMessage_1.TextMessage("___close", {}, this.alias).toString());
        return this;
    };
    ;
    Proxy.prototype.Subscribe = function (topic, callback) {
        this.ws.send(new TextMessage_1.TextMessage("___subscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
        return this.On(topic, callback);
    };
    ;
    Proxy.prototype.Unsubscribe = function (topic) {
        this.ws.send(new TextMessage_1.TextMessage("___unsubscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
    };
    ;
    Proxy.prototype.On = function (topic, fn) {
        var listener = new Listener_1.Listener(topic, fn);
        this.listeners.push(listener);
        return listener;
    };
    ;
    Proxy.prototype.findListener = function (topic) {
        var listener = this.listeners.find(function (pre) {
            return pre.topic === topic;
        });
        return listener;
    };
    Proxy.prototype.Off = function (topic) {
        var index = this.listeners.indexOf(this.findListener(topic));
        if (index >= 0)
            this.listeners.splice(index, 1);
    };
    ;
    Proxy.prototype.InvokeBinary = function (buffer) {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    };
    Proxy.prototype.PublishBinary = function (buffer) {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    };
    Proxy.prototype.Invoke = function (topic, data, controller) {
        this.ws.send(new TextMessage_1.TextMessage(topic, data, controller || this.alias).toString());
        return this;
    };
    ;
    Proxy.prototype.Publish = function (topic, data, controller) {
        this.ws.send(new TextMessage_1.TextMessage(topic, data, controller || this.alias).toString());
        return this;
    };
    ;
    Proxy.prototype.SetProperty = function (propName, propValue, controller) {
        this.Invoke(propName, propValue, controller || this.alias);
        return this;
    };
    ;
    Proxy.prototype.Dispatch = function (topic, data, buffer) {
        if (topic === "___open") {
            this.IsConnected = true;
            this.OnOpen(JSON.parse(data));
            return;
        }
        else if (topic === "___close") {
            this.OnClose([JSON.parse(data)]);
            this.IsConnected = false;
        }
        else {
            var listener = this.findListener(topic);
            if (listener)
                listener.fn(JSON.parse(data), buffer);
        }
    };
    ;
    return Proxy;
}());
exports.Proxy = Proxy;
//# sourceMappingURL=Proxy.js.map