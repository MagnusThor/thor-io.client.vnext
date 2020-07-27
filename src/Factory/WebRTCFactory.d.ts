import { ThorIOConnection } from './Models/ThorIOConnection';
import { BandwidthConstraints } from '../Utils/BandwidthConstraints';
import { IE2EE } from '../E2EE/E2EEBase';
import { DataChannel } from '../DataChannels/DataChannel';
import { ContextConnection } from './Models/ContextConnection';
import { Controller } from '../Controller/Controller';
export declare class WebRTCFactory {
    private signalingController;
    private rtcConfig;
    peers: Map<string, ThorIOConnection>;
    peer: RTCPeerConnection;
    dataChannels: Map<string, DataChannel>;
    localPeerId: string;
    context: string;
    localStreams: Array<any>;
    bandwidthConstraints: BandwidthConstraints;
    e2ee: IE2EE;
    isEncrypted: boolean;
    onError: (err: any) => void;
    onContextCreated: (peerConnection: ContextConnection) => void;
    onContextChanged: (context: {
        context: string;
        peerId: string;
    }) => void;
    onRemoteAudioTrack: (track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void;
    onRemoteVideoTrack: (track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void;
    onRemoteTrack: (track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void;
    onRemoteTrackLost: (track: MediaStreamTrack, connection: ThorIOConnection, event: MediaStreamTrackEvent) => void;
    onLocalStream: (stream: MediaStream) => void;
    onContextConnected: (webRTCConnection: ThorIOConnection, rtcPeerConnection: RTCPeerConnection) => void;
    onContextDisconnected: (webRTCConnection: ThorIOConnection, rtcPeerConnection: RTCPeerConnection) => void;
    private onConnectAll;
    private onConnected;
    onDisconnected(peerId: string): void;
    constructor(signalingController: Controller, rtcConfig: any, e2ee?: IE2EE);
    addTrackToPeers(track: MediaStreamTrack): void;
    removeTrackFromPeers(track: MediaStreamTrack): void;
    getRtpSenders(peerId: string): Array<RTCRtpSender>;
    getRtpReceivers(peerId: string): Array<RTCRtpReceiver>;
    setBandwithConstraints(videobandwidth: number, audiobandwidth: number): void;
    private setMediaBitrates;
    private setMediaBitrate;
    createDataChannel(name: string): DataChannel;
    removeDataChannel(name: string): void;
    private addError;
    private onCandidate;
    private onAnswer;
    private onOffer;
    addLocalStream(stream: any): WebRTCFactory;
    addIceServer(iceServer: RTCIceServer): WebRTCFactory;
    removePeerConnection(id: string): void;
    private createRTCPeerConnection;
    cleanUp(id: string): void;
    findPeerConnection(id: string): ThorIOConnection;
    reconnectAll(): Array<ContextConnection>;
    private getOrCreateRTCPeerConnection;
    private createOffer;
    disconnect(): void;
    disconnectPeer(id: string): void;
    connect(peerConnections: Array<ContextConnection>): void;
    connectTo(peerConnection: ContextConnection): void;
    changeContext(context: string): WebRTCFactory;
    private connectPeers;
    connectContext(): void;
}