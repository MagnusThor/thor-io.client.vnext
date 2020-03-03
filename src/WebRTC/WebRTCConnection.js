"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebRTCConnection = /** @class */ (function () {
    function WebRTCConnection(id, rtcPeerConnection) {
        this.id = id;
        this.RTCPeer = rtcPeerConnection;
        this.stream = new MediaStream();
    }
    return WebRTCConnection;
}());
exports.WebRTCConnection = WebRTCConnection;
//# sourceMappingURL=WebRTCConnection.js.map