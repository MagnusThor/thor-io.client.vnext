export class WebRTCConnection {
    id: string;
    RTCPeer: RTCPeerConnection;
    Stream: MediaStream;
    constructor(id: string, rtcPeerConnection: RTCPeerConnection) {
        this.id = id;
        this.RTCPeer = rtcPeerConnection;
        this.Stream = new MediaStream();
    }
}
