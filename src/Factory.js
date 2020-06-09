"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BinaryMessage_1 = require("./Messages/BinaryMessage");
var Controller_1 = require("./Controller");
var Factory = (function () {
    function Factory(url, controllers, params) {
        var _this = this;
        this.url = url;
        this.controllers = new Map();
        this.ws = new WebSocket(url + this.toQuery(params || {}));
        this.ws.binaryType = "arraybuffer";
        controllers.forEach(function (alias) {
            _this.controllers.set(alias, new Controller_1.Controller(alias, _this.ws));
        });
        this.ws.onmessage = function (event) {
            if (typeof (event.data) !== "object") {
                var message = JSON.parse(event.data);
                _this.getController(message.C).dispatch(message.T, message.D);
            }
            else {
                var message = BinaryMessage_1.BinaryMessage.fromArrayBuffer(event.data);
                _this.getController(message.C).dispatch(message.T, message.D, message.B);
            }
        };
        this.ws.onclose = function (event) {
            _this.IsConnected = false;
            _this.onClose.apply(_this, [event]);
        };
        this.ws.onerror = function (error) {
            _this.onError.apply(_this, [error]);
        };
        this.ws.onopen = function (event) {
            _this.IsConnected = true;
            _this.onOpen.apply(_this, Array.from(_this.controllers.values()));
        };
    }
    Factory.prototype.toQuery = function (obj) {
        return "?" + Object.keys(obj).map(function (key) { return (encodeURIComponent(key) + "=" +
            encodeURIComponent(obj[key])); }).join("&");
    };
    Factory.prototype.close = function () {
        this.ws.close();
    };
    Factory.prototype.getController = function (alias) {
        return this.controllers.get(alias);
    };
    Factory.prototype.removeController = function (alias) {
        this.controllers.delete(alias);
    };
    Factory.prototype.onOpen = function (controllers) { };
    Factory.prototype.onError = function (error) { };
    Factory.prototype.onClose = function (event) { };
    return Factory;
}());
exports.Factory = Factory;
