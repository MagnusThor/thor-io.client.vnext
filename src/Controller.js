"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextMessage_1 = require("./Messages/TextMessage");
var Listener_1 = require("./Listener");
var Controller = (function () {
    function Controller(alias, ws) {
        var _this = this;
        this.alias = alias;
        this.ws = ws;
        this.listeners = new Map();
        this.IsConnected = false;
        this.on("___error", function (err) {
            _this.onError(err);
        });
    }
    Controller.prototype.onError = function (event) { };
    Controller.prototype.onOpen = function (event) { };
    Controller.prototype.onClose = function (event) { };
    Controller.prototype.connect = function () {
        this.ws.send(new TextMessage_1.TextMessage("___connect", {}, this.alias, null, null, true).toString());
        return this;
    };
    ;
    Controller.prototype.close = function () {
        this.ws.send(new TextMessage_1.TextMessage("___close", {}, this.alias, null, null, true).toString());
        return this;
    };
    ;
    Controller.prototype.subscribe = function (topic, callback) {
        this.ws.send(new TextMessage_1.TextMessage("___subscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
        return this.on(topic, callback);
    };
    Controller.prototype.unsubscribe = function (topic) {
        this.ws.send(new TextMessage_1.TextMessage("___unsubscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
    };
    Controller.prototype.on = function (topic, fn) {
        var listener = new Listener_1.Listener(topic, fn);
        this.listeners.set(topic, listener);
        return listener;
    };
    Controller.prototype.of = function (topic) {
        this.listeners.delete(topic);
    };
    Controller.prototype.findListener = function (topic) {
        return this.listeners.get(topic);
    };
    Controller.prototype.invokeBinary = function (buffer) {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    };
    Controller.prototype.publishBinary = function (buffer) {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    };
    Controller.prototype.invoke = function (method, data, controller) {
        this.ws.send(new TextMessage_1.TextMessage(method, data, controller || this.alias, null, null, true).toString());
        return this;
    };
    Controller.prototype.publish = function (topic, data, controller) {
        this.invoke(topic, data, controller || this.alias);
        return this;
    };
    Controller.prototype.setProperty = function (propName, propValue, controller) {
        this.invoke(propName, propValue, controller || this.alias);
        return this;
    };
    Controller.prototype.dispatch = function (topic, data, buffer) {
        if (topic === "___open") {
            this.IsConnected = true;
            this.onOpen(JSON.parse(data));
            return;
        }
        else if (topic === "___close") {
            this.onClose([JSON.parse(data)]);
            this.IsConnected = false;
        }
        else {
            var listener = this.findListener(topic);
            if (listener)
                listener.fn(JSON.parse(data), buffer);
        }
    };
    return Controller;
}());
exports.Controller = Controller;
