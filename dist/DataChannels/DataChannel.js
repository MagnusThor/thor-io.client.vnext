"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataChannel = void 0;
const BinaryMessage_1 = require("../Messages/BinaryMessage");
const TextMessage_1 = require("../Messages/TextMessage");
const Utils_1 = require("../Utils/Utils");
const DataChannelListner_1 = require("./DataChannelListner");
class DataChannel {
    constructor(label, listeners) {
        this.Listners = listeners || new Map();
        this.PeerChannels = new Map();
        this.label = label;
        this.messageFragments = new Map();
    }
    findListener(topic) {
        let listener = Array.from(this.Listners.values()).find((pre) => {
            return pre.channelName === this.label && pre.topic === topic;
        });
        return listener;
    }
    on(topic, fn) {
        var listener = new DataChannelListner_1.DataChannelListner(this.label, topic, fn);
        this.Listners.set(topic, listener);
        return listener;
    }
    off(topic) {
        return this.Listners.delete(topic);
    }
    onOpen(event, peerId, name) { }
    onClose(event, peerId, name) { }
    addMessageFragment(message) {
        if (!this.messageFragments.has(message.I)) {
            const data = { msg: message, receiveBuffer: new ArrayBuffer(0) };
            data.receiveBuffer = Utils_1.Utils.joinBuffers(data.receiveBuffer, message.B);
            this.messageFragments.set(message.I, data);
        }
        else {
            let current = this.messageFragments.get(message.I);
            current.receiveBuffer = Utils_1.Utils.joinBuffers(current.receiveBuffer, message.B);
        }
        if (message.F) {
            let result = this.messageFragments.get(message.I);
            result.msg.B = result.receiveBuffer;
            this.dispatchMessage(result.msg);
            this.messageFragments.delete(message.I);
        }
        message.B = new ArrayBuffer(0);
    }
    dispatchMessage(msg) {
        let listener = this.findListener(msg.T);
        listener && listener.action.apply(this, [JSON.parse(msg.D), msg.B]);
    }
    onMessage(event) {
        const isBinary = typeof (event.data) !== "string";
        if (isBinary) {
            this.addMessageFragment(BinaryMessage_1.BinaryMessage.fromArrayBuffer(event.data));
        }
        else {
            this.dispatchMessage(JSON.parse(event.data));
        }
    }
    close(name) {
        this.PeerChannels.forEach((pc) => {
            if (pc.dataChannel.label === name || this.label)
                pc.dataChannel.close();
        });
    }
    invoke(topic, data, isFinal, uuid) {
        this.PeerChannels.forEach((channel) => {
            if (channel.dataChannel.readyState === "open" && channel.label === this.label) {
                channel.dataChannel.send(new TextMessage_1.TextMessage(topic, data, channel.label, null, uuid, isFinal).toString());
            }
        });
        return this;
    }
    invokeBinary(topic, data, arrayBuffer, isFinal, uuid) {
        let m = new TextMessage_1.TextMessage(topic, data, this.label, null, uuid, isFinal);
        const message = new BinaryMessage_1.BinaryMessage(m.toString(), arrayBuffer);
        this.PeerChannels.forEach((channel) => {
            if (channel.dataChannel.readyState === "open" && channel.label === this.label) {
                channel.dataChannel.send(message.buffer);
            }
        });
        return this;
    }
    addPeerChannel(pc) {
        this.PeerChannels.set({
            id: pc.peerId, name: pc.label
        }, pc);
    }
    removePeerChannel(id) {
        return this.PeerChannels.delete({ id: id, name: this.label });
    }
}
exports.DataChannel = DataChannel;
