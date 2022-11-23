"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeerChannel = void 0;
class PeerChannel {
    constructor(peerId, dataChannel, label) {
        this.peerId = peerId;
        this.dataChannel = dataChannel;
        this.label = label;
    }
}
exports.PeerChannel = PeerChannel;
