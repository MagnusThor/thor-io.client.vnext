export class WebRTCConnection {
    id: string;
    RTCPeer: RTCPeerConnection;
    constructor(id: string, rtcPeerConnection: RTCPeerConnection) {
        this.id = id;
        this.RTCPeer = rtcPeerConnection;
      
    }
}
