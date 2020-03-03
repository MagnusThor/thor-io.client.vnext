export class WebRTCConnection {
    id: string;
    RTCPeer: RTCPeerConnection;
    stream: MediaStream;
    constructor(id: string, rtcPeerConnection: RTCPeerConnection) {
        this.id = id;
        this.RTCPeer = rtcPeerConnection;
        this.stream = new MediaStream();
    }
}
