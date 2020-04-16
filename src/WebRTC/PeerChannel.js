"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PeerChannel = (function () {
    function PeerChannel(peerId, dataChannel, label) {
        this.peerId = peerId;
        this.dataChannel = dataChannel;
        this.label = label;
    }
    return PeerChannel;
}());
exports.PeerChannel = PeerChannel;
