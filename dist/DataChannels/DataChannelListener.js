"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataChannelListener = void 0;
const Listener_1 = require("../Events/Listener");
class DataChannelListener extends Listener_1.Listener {
    constructor(channelName, topic, fn) {
        super(topic, fn);
        this.channelName = channelName;
        this.count = 0;
    }
}
exports.DataChannelListener = DataChannelListener;
