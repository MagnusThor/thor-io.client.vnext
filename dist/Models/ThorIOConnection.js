"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThorIOConnection = void 0;
const Utils_1 = require("../Utils/Utils");
class ThorIOConnection {
    constructor(id, rtcPeerConnection) {
        this.id = id;
        this.peerConnection = rtcPeerConnection;
        this.uuid = Utils_1.Utils.newGuid();
    }
    getSenders() {
        return this.peerConnection.getSenders();
    }
    getReceivers() {
        return this.peerConnection.getReceivers();
    }
    getTransceivers() {
        return this.peerConnection.getTransceivers();
    }
}
exports.ThorIOConnection = ThorIOConnection;
