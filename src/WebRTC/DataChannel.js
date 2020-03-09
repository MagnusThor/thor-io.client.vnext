"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextMessage_1 = require("../Messages/TextMessage");
var Listener_1 = require("../Listener");
var DataChannel = (function () {
    function DataChannel(name, listeners) {
        this.listeners = listeners || new Map();
        this.PeerChannels = new Map();
        this.Name = name;
    }
    DataChannel.prototype.findListener = function (topic) {
        return this.listeners.get(topic);
    };
    DataChannel.prototype.On = function (topic, fn) {
        var listener = new Listener_1.Listener(topic, fn);
        this.listeners.set(topic, listener);
        return listener;
    };
    DataChannel.prototype.Off = function (topic) {
        return this.listeners.delete(topic);
    };
    DataChannel.prototype.OnOpen = function (event, peerId) { };
    DataChannel.prototype.OnClose = function (event, peerId) { };
    DataChannel.prototype.onMessage = function (event) {
        var msg = JSON.parse(event.data);
        var listener = this.findListener(msg.T);
        if (listener)
            listener.fn.apply(this, [JSON.parse(msg.D)]);
    };
    DataChannel.prototype.Close = function () {
        this.PeerChannels.forEach(function (pc) {
            pc.dataChannel.close();
        });
    };
    DataChannel.prototype.Invoke = function (topic, data, controller) {
        var _this = this;
        this.PeerChannels.forEach(function (channel) {
            if (channel.dataChannel.readyState === "open") {
                channel.dataChannel.send(new TextMessage_1.TextMessage(topic, data, _this.Name).toString());
            }
        });
        return this;
    };
    DataChannel.prototype.addPeerChannel = function (pc) {
        this.PeerChannels.set(pc.peerId, pc);
    };
    DataChannel.prototype.removePeerChannel = function (id) {
        return this.PeerChannels.delete(id);
    };
    return DataChannel;
}());
exports.DataChannel = DataChannel;
