"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataChannelListner = void 0;
const Listener_1 = require("../Events/Listener");
class DataChannelListner extends Listener_1.Listener {
    constructor(channelName, topic, fn) {
        super(topic, fn);
        this.channelName = channelName;
        this.count = 0;
    }
}
exports.DataChannelListner = DataChannelListner;
