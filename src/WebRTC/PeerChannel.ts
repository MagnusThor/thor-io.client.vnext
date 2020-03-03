export class PeerChannel {
    dataChannel: RTCDataChannel;
    peerId: string;
    label: string;
    constructor(peerId:string, dataChannel:RTCDataChannel, label:string) {
        this.peerId = peerId;
        this.dataChannel = dataChannel;
        this.label = label; // name
    }
}
