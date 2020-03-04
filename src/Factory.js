"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BinaryMessage_1 = require("./Messages/BinaryMessage");
var Controller_1 = require("./Controller");
var Factory = (function () {
    function Factory(url, controllers, params) {
        var _this = this;
        this.url = url;
        this.proxys = new Map();
        this.ws = new WebSocket(url + this.toQuery(params || {}));
        this.ws.binaryType = "arraybuffer";
        controllers.forEach(function (alias) {
            _this.proxys.set(alias, new Controller_1.Controller(alias, _this.ws));
        });
        this.ws.onmessage = function (event) {
            if (typeof (event.data) !== "object") {
                var message = JSON.parse(event.data);
                _this.GetProxy(message.C).Dispatch(message.T, message.D);
            }
            else {
                var message = BinaryMessage_1.BinaryMessage.fromArrayBuffer(event.data);
                _this.GetProxy(message.C).Dispatch(message.T, message.D, message.B);
            }
        };
        this.ws.onclose = function (event) {
            _this.IsConnected = false;
            _this.OnClose.apply(_this, [event]);
        };
        this.ws.onerror = function (error) {
            _this.OnError.apply(_this, [error]);
        };
        this.ws.onopen = function (event) {
            _this.IsConnected = true;
            _this.OnOpen.apply(_this, _this.proxys);
        };
    }
    Factory.prototype.toQuery = function (obj) {
        return "?" + Object.keys(obj).map(function (key) { return (encodeURIComponent(key) + "=" +
            encodeURIComponent(obj[key])); }).join("&");
    };
    Factory.prototype.Close = function () {
        this.ws.close();
    };
    Factory.prototype.GetProxy = function (alias) {
        return this.proxys.get(alias);
    };
    Factory.prototype.RemoveProxy = function (alias) {
        this.proxys.delete(alias);
    };
    Factory.prototype.OnOpen = function (proxys) { };
    Factory.prototype.OnError = function (error) { };
    Factory.prototype.OnClose = function (event) { };
    return Factory;
}());
exports.Factory = Factory;
