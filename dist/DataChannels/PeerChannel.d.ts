export declare class PeerChannel {
    dataChannel: RTCDataChannel;
    peerId: string;
    label: string;
    constructor(peerId: string, dataChannel: RTCDataChannel, label: string);
}
