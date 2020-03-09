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
        this.On("___error", function (err) {
            _this.OnError(err);
        });
    }
    Controller.prototype.OnError = function (event) { };
    Controller.prototype.OnOpen = function (event) { };
    Controller.prototype.OnClose = function (event) { };
    Controller.prototype.Connect = function () {
        this.ws.send(new TextMessage_1.TextMessage("___connect", {}, this.alias).toString());
        return this;
    };
    ;
    Controller.prototype.Close = function () {
        this.ws.send(new TextMessage_1.TextMessage("___close", {}, this.alias).toString());
        return this;
    };
    ;
    Controller.prototype.Subscribe = function (topic, callback) {
        this.ws.send(new TextMessage_1.TextMessage("___subscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
        return this.On(topic, callback);
    };
    Controller.prototype.Unsubscribe = function (topic) {
        this.ws.send(new TextMessage_1.TextMessage("___unsubscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
    };
    Controller.prototype.On = function (topic, fn) {
        var listener = new Listener_1.Listener(topic, fn);
        this.listeners.set(topic, listener);
        return listener;
    };
    Controller.prototype.Off = function (topic) {
        this.listeners.delete(topic);
    };
    Controller.prototype.findListener = function (topic) {
        return this.listeners.get(topic);
    };
    Controller.prototype.InvokeBinary = function (buffer) {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    };
    Controller.prototype.PublishBinary = function (buffer) {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    };
    Controller.prototype.Invoke = function (method, data, controller) {
        this.ws.send(new TextMessage_1.TextMessage(method, data, controller || this.alias).toString());
        return this;
    };
    Controller.prototype.Publish = function (topic, data, controller) {
        this.Invoke(topic, data, controller || this.alias);
        return this;
    };
    Controller.prototype.SetProperty = function (propName, propValue, controller) {
        this.Invoke(propName, propValue, controller || this.alias);
        return this;
    };
    Controller.prototype.Dispatch = function (topic, data, buffer) {
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
    return Controller;
}());
exports.Controller = Controller;
