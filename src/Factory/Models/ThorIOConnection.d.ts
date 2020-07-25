export declare class ThorIOConnection {
    id: string;
    peerConnection: RTCPeerConnection;
    uuid: string;
    constructor(id: string, rtcPeerConnection: RTCPeerConnection);
    getSenders(): Array<RTCRtpSender>;
    getReceivers(): Array<RTCRtpReceiver>;
    getTransceivers(): Array<RTCRtpTransceiver>;
}
