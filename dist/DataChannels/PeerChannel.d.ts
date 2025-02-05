export declare class PeerChannel {
    peerId: string;
    dataChannel: RTCDataChannel;
    label: string;
    constructor(peerId: string, dataChannel: RTCDataChannel, label: string);
}
