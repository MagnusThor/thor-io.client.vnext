"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextMessage_1 = require("../Messages/TextMessage");
var DataChannelListner_1 = require("../DataChannels/DataChannelListner");
var BinaryMessage_1 = require("../Messages/BinaryMessage");
var DataChannel = (function () {
    function DataChannel(label, listeners) {
        this.Listners = listeners || new Map();
        this.PeerChannels = new Map();
        this.label = label;
        this.messageFragments = new Map();
    }
    DataChannel.prototype.findListener = function (topic) {
        var _this = this;
        var listener = Array.from(this.Listners.values()).find(function (pre) {
            return pre.channelName === _this.label && pre.topic === topic;
        });
        return listener;
    };
    DataChannel.prototype.On = function (topic, fn) {
        var listener = new DataChannelListner_1.DataChannelListner(this.label, topic, fn);
        this.Listners.set(topic, listener);
        return listener;
    };
    DataChannel.prototype.Off = function (topic) {
        return this.Listners.delete(topic);
    };
    DataChannel.prototype.OnOpen = function (event, peerId, name) { };
    DataChannel.prototype.OnClose = function (event, peerId, name) { };
    DataChannel.prototype.addMessage = function (message) {
        var _a;
        if (!this.messageFragments.has(message.I)) {
            this.messageFragments.set(message.I, { msg: message, receiveBuffer: new Array(message.B) });
        }
        else {
            this.messageFragments.get(message.I).receiveBuffer.push(message.B);
        }
        if (message.F) {
            var result = this.messageFragments.get(message.I);
            this.dispatchMessage(result.msg);
            var combined = Uint8Array.from((_a = Array.prototype).concat.apply(_a, result.receiveBuffer.map(function (a) { return Array.from(a); })));
            result.msg.B = combined.buffer;
            this.messageFragments.delete(message.I);
        }
        message.B = new ArrayBuffer(0);
    };
    DataChannel.prototype.dispatchMessage = function (msg) {
        var listener = this.findListener(msg.T);
        listener && listener.fn.apply(this, [JSON.parse(msg.D), msg.B]);
    };
    DataChannel.prototype.onMessage = function (event) {
        var isBinary = typeof (event.data) !== "string";
        if (isBinary) {
            this.addMessage(BinaryMessage_1.BinaryMessage.fromArrayBuffer(event.data));
        }
        else {
            this.dispatchMessage(JSON.parse(event.data));
        }
    };
    DataChannel.prototype.Close = function (name) {
        var _this = this;
        this.PeerChannels.forEach(function (pc) {
            if (pc.dataChannel.label === name || _this.label)
                pc.dataChannel.close();
        });
    };
    DataChannel.prototype.Invoke = function (topic, data, isFinal, uuid) {
        var _this = this;
        this.PeerChannels.forEach(function (channel) {
            if (channel.dataChannel.readyState === "open" && channel.label === _this.label) {
                channel.dataChannel.send(new TextMessage_1.TextMessage(topic, data, channel.label, null, uuid, isFinal).toString());
            }
        });
        return this;
    };
    DataChannel.prototype.InvokeBinary = function (topic, data, arrayBuffer, isFinal, uuid) {
        var _this = this;
        var m = new TextMessage_1.TextMessage(topic, data, this.label, null, uuid, isFinal);
        var message = new BinaryMessage_1.BinaryMessage(m.toString(), arrayBuffer);
        this.PeerChannels.forEach(function (channel) {
            if (channel.dataChannel.readyState === "open" && channel.label === _this.label) {
                channel.dataChannel.send(message.Buffer);
            }
        });
        return this;
    };
    DataChannel.prototype.addPeerChannel = function (pc) {
        this.PeerChannels.set({
            id: pc.peerId, name: pc.label
        }, pc);
    };
    DataChannel.prototype.removePeerChannel = function (id) {
        return this.PeerChannels.delete({ id: id, name: this.label });
    };
    return DataChannel;
}());
exports.DataChannel = DataChannel;
