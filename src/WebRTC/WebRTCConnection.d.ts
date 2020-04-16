export declare class WebRTCConnection {
    id: string;
    RTCPeer: RTCPeerConnection;
    stream: MediaStream;
    constructor(id: string, rtcPeerConnection: RTCPeerConnection);
}
