export declare class WebRTCConnection {
    id: string;
    RTCPeer: RTCPeerConnection;
    Stream: MediaStream;
    constructor(id: string, rtcPeerConnection: RTCPeerConnection);
}
