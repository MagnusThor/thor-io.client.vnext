"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebRTCConnection = (function () {
    function WebRTCConnection(id, rtcPeerConnection) {
        this.id = id;
        this.RTCPeer = rtcPeerConnection;
        this.Stream = new MediaStream();
    }
    return WebRTCConnection;
}());
exports.WebRTCConnection = WebRTCConnection;
