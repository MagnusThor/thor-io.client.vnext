import { ThorIOConnection } from './Models/ThorIOConnection';
import { BandwidthConstraints } from '../Utils/BandwidthConstraints';
import { IE2EE } from '../E2EE/E2EEBase';
import { DataChannel } from '../DataChannels/DataChannel';
import { ContextConnection } from './Models/ContextConnection';
import { Controller } from '../Controller/Controller';
/**
 *  WebRTC abstraction layer for thor-io.vnext
 *
 * @export
 * @class WebRTC
 */
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
    /**
     * Fires when an error occurs
     *
     * @memberof WebRTC
     */
    onError: (err: any) => void;
    /**
     * Fires when client connects to broker
     *
     * @memberof WebRTC
     */
    onContextCreated: (peerConnection: ContextConnection) => void;
    /**
     * Fires when client changes context ,and server confirms
     *
     * @memberof WebRTC
     */
    onContextChanged: (context: {
        context: string;
        peerId: string;
    }) => void;
    /**
     * Fires when a remote audio track is lost
     *
     * @memberof WebRTC
     */
    onRemoteAudioTrack: (track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void;
    /**
     *  Fires when a remote video track is added
     *
     * @memberof WebRTC
     */
    onRemoteVideoTrack: (track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void;
    /**
     * FIres when a remote video or audio track is added
     *
     * @memberof WebRTC
     */
    onRemoteTrack: (track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void;
    /**
     * Fires when a remote track is lost
     *
     * @memberof WebRTC
     */
    onRemoteTrackLost: (track: MediaStreamTrack, connection: ThorIOConnection, event: MediaStreamTrackEvent) => void;
    /**
     * Fires when local MediaStream is added
     *
     * @memberof WebRTC
     */
    onLocalStream: (stream: MediaStream) => void;
    /**
     * Fires for each WebRTCConnection that connects sucessfully to context and client
     *
     * @memberof WebRTC
     */
    onContextConnected: (webRTCConnection: ThorIOConnection, rtcPeerConnection: RTCPeerConnection) => void;
    /**
     * Fires when a WebRTCConnection is closed or lost.
     *
     * @memberof WebRTC
     */
    onContextDisconnected: (webRTCConnection: ThorIOConnection, rtcPeerConnection: RTCPeerConnection) => void;
    private onConnectAll;
    private onConnected;
    /**
     * Fires when an RTCPeerConnection is lost
     *
     * @param {string} peerId
     * @memberof WebRTC
     */
    onDisconnected(peerId: string): void;
    /**
     *Creates an instance of WebRTC.
     * @param {Controller} signalingController
     * @param {RTCPeerConnectionConfig} rtcConfig
     * @param {IE2EE} [e2ee]
     * @memberof WebRTC
     */
    constructor(signalingController: Controller, rtcConfig: any, e2ee?: IE2EE);
    /**
     * Add a MediaStreamTrack to remote peers.
     *
     * @param {MediaStreamTrack} track
     * @memberof WebRTC
     */
    addTrackToPeers(track: MediaStreamTrack): void;
    /**
     * Remove a MediaStreamTrack from the remote peers
     *
     * @param {MediaStreamTrack} track
     * @memberof WebRTC
     */
    removeTrackFromPeers(track: MediaStreamTrack): void;
    /**
     * Get the RTCRtpSender's for the specified peer.
     *
     * @param {string} peerId
     * @returns {Array<RTCRtpSender>}
     * @memberof WebRTC
     */
    getRtpSenders(peerId: string): Array<RTCRtpSender>;
    /**
     * Get rhe RTCRtpReceiver's for the specified peer.
     *
     * @param {string} peerId
     * @returns {Array<RTCRtpReceiver>}
     * @memberof WebRTC
     */
    getRtpReceivers(peerId: string): Array<RTCRtpReceiver>;
    /**
     * Set video and audio bandwidth constraints.
     *
     * @param {number} videobandwidth
     * @param {number} audiobandwidth
     * @memberof WebRTC
     */
    setBandwithConstraints(videobandwidth: number, audiobandwidth: number): void;
    private setMediaBitrates;
    private setMediaBitrate;
    /**
     * Create a new DataChannel
     *
     * @param {string} name
     * @returns {DataChannel}
     * @memberof WebRTC
     */
    createDataChannel(name: string): DataChannel;
    /**
     * Remove the DataChannel
     *
     * @param {string} name
     * @memberof WebRTC
     */
    removeDataChannel(name: string): void;
    private addError;
    private onCandidate;
    private onAnswer;
    private onOffer;
    /**
     * Add a local MediaStream to the client
     *
     * @param {*} stream
     * @returns {WebRTCFactory}
     * @memberof WebRTC
     */
    addLocalStream(stream: any): WebRTCFactory;
    /**
     * Add an iceServer iceServers configuration
     *
     * @param {RTCIceServer} iceServer
     * @returns {WebRTCFactory}
     * @memberof WebRTC
     */
    addIceServer(iceServer: RTCIceServer): WebRTCFactory;
    removePeerConnection(id: string): void;
    private createRTCPeerConnection;
    cleanUp(id: string): void;
    /**
     *  Find a WebRTCConnection based in it's id
     *
     * @param {string} id
     * @returns {ThorIOConnection}
     * @memberof WebRTC
     */
    findPeerConnection(id: string): ThorIOConnection;
    /**
     * Reconnect all Peers
     *
     * @returns {Array<ContextConnection>}
     * @memberof WebRTC
     * @deprecated
     */
    reconnectAll(): Array<ContextConnection>;
    private getOrCreateRTCPeerConnection;
    private createOffer;
    /**
     * Close all connections
     *
     * @memberof WebRTC
     */
    disconnect(): void;
    /**
     * Close the specified PeerConnection
     *
     * @param {string} id
     * @memberof WebRTC
     */
    disconnectPeer(id: string): void;
    /**
     * Connect all Peers
     *
     * @param {Array<ContextConnection>} peerConnections
     * @memberof WebRTC
     */
    connect(peerConnections: Array<ContextConnection>): void;
    connectTo(peerConnection: ContextConnection): void;
    /**
     * Change context
     *
     * @param {string} context
     * @returns {WebRTCFactory}
     * @memberof WebRTC
     */
    changeContext(context: string): WebRTCFactory;
    private connectPeers;
    /**
     * Connect to the context and all it's current ContextConnections)
     *
     * @memberof WebRTC
     */
    connectContext(): void;
}
