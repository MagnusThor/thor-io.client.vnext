"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PeerChannel {
    constructor(peerId, dataChannel, label) {
        this.peerId = peerId;
        this.dataChannel = dataChannel;
        this.label = label;
    }
}
exports.PeerChannel = PeerChannel;
