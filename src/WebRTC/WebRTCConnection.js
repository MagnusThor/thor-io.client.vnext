"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebRTCConnection {
    constructor(id, rtcPeerConnection) {
        this.id = id;
        this.RTCPeer = rtcPeerConnection;
        this.stream = new MediaStream();
    }
}
exports.WebRTCConnection = WebRTCConnection;
