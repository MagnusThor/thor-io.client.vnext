"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextMessage_1 = require("../Messages/TextMessage");
var Listener_1 = require("../Listener");
var DataChannel = /** @class */ (function () {
    function DataChannel(name, listeners) {
        this.listeners = listeners || new Array();
        this.PeerChannels = new Array();
        this.Name = name;
    }
    DataChannel.prototype.On = function (topic, fn) {
        var listener = new Listener_1.Listener(topic, fn);
        this.listeners.push(listener);
        return listener;
    };
    ;
    DataChannel.prototype.OnOpen = function (event, peerId) { };
    ;
    DataChannel.prototype.OnClose = function (event, peerId) { };
    DataChannel.prototype.OnMessage = function (event) {
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
    DataChannel.prototype.findListener = function (topic) {
        var listener = this.listeners.find(function (pre) {
            return pre.topic === topic;
        });
        return listener;
    };
    DataChannel.prototype.Off = function (topic) {
        var index = this.listeners.indexOf(this.findListener(topic));
        if (index >= 0)
            this.listeners.splice(index, 1);
    };
    ;
    DataChannel.prototype.Invoke = function (topic, data, controller) {
        var _this = this;
        this.PeerChannels.forEach(function (channel) {
            if (channel.dataChannel.readyState === "open") {
                channel.dataChannel.send(new TextMessage_1.TextMessage(topic, data, _this.Name).toString());
            }
        });
        return this;
    };
    DataChannel.prototype.AddPeerChannel = function (pc) {
        this.PeerChannels.push(pc);
    };
    DataChannel.prototype.RemovePeerChannel = function (id) {
        var match = this.PeerChannels.find(function (p) {
            return p.peerId === id;
        });
        var index = this.PeerChannels.indexOf(match);
        if (index > -1)
            this.PeerChannels.splice(index, 1);
    };
    return DataChannel;
}());
exports.DataChannel = DataChannel;
//# sourceMappingURL=DataChannel.js.map