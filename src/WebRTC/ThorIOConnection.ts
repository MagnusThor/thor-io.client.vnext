import { Utils } from '../Utils/Utils';
export class ThorIOConnection {
    id: string;
    peerConnection: RTCPeerConnection;
    uuid: string;
    constructor(id: string, rtcPeerConnection: RTCPeerConnection) {
        this.id = id;
        this.peerConnection = rtcPeerConnection;
        this.uuid = Utils.newGuid();
    }
    getSenders(): Array<RTCRtpSender> {
        return this.peerConnection.getSenders();
    }
    getReceivers(): Array<RTCRtpReceiver> {
        return this.peerConnection.getReceivers();
    }
    getTransceivers(): Array<RTCRtpTransceiver> {
        return this.peerConnection.getTransceivers();
    }
}
