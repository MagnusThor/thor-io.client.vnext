import { PeerConnection } from "./PeerConnection";
import { WebRTCConnection } from "./WebRTCConnection";
import { PeerChannel } from "./PeerChannel";
import { DataChannel } from './DataChannel';
import { BandwidthConstraints } from "./BandwidthConstraints";
import { Controller } from "../Controller";
import { E2EEBase, IE2EE } from '../E2EE/EncodeDecode';

/**
 *  WebRTC abstraction layer for thor-io
 *
 * @export
 * @class WebRTC
 */
export class WebRTC {

    public peers: Map<string, WebRTCConnection>;
    public peer: RTCPeerConnection;
    public dataChannels: Map<string, DataChannel>;
    public localPeerId: string;
    public context: any;
    public localStreams: Array<any>;
    public errors: Array<any>;
    public bandwidthConstraints: BandwidthConstraints;
    public e2ee: IE2EE;
    public isEncrypted: boolean;


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
    onContextCreated: (peerConnection: PeerConnection) => void;
    /**
     * Fires when client changes context ,and server confirms
     *
     * @memberof WebRTC
     */
    onContextChanged: (context: { context: string, peerId: string }) => void;

    /**
     * Fires when a remote audio track is lost
     *
     * @memberof WebRTC
     */
    onRemoteAudioTrack: (track: MediaStreamTrack, connection: WebRTCConnection, event: RTCTrackEvent) => void;
    /**
     *  Fires when a remote video track is added
     *
     * @memberof WebRTC
     */
    onRemoteVideoTrack: (track: MediaStreamTrack, connection: WebRTCConnection, event: RTCTrackEvent) => void;
    /**
     * FIres when a remote video or audio track is added
     *
     * @memberof WebRTC
     */
    onRemoteTrack: (track: MediaStreamTrack, connection: WebRTCConnection, event: RTCTrackEvent) => void;
    /**
     * Fires when a remote track is lost
     *
     * @memberof WebRTC
     */
    onRemoteTrackLost: (track: MediaStreamTrack, connection: WebRTCConnection, event: MediaStreamTrackEvent) => void
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
    onContextConnected: (webRTCConnection: WebRTCConnection, rtcPeerConnection: RTCPeerConnection) => void;
    /**
     * Fires when a WebRTCConnection is closed or lost.
     *
     * @memberof WebRTC
     */
    onContextDisconnected: (webRTCConnection: WebRTCConnection, rtcPeerConnection: RTCPeerConnection) => void;

    private onConnectTo(peerConnections: Array<PeerConnection>) {
        this.connect(peerConnections);
    }

    private onConnected(peerId: string) {
        if (this.onContextConnected)
            this.onContextConnected(this.findPeerConnection(peerId), this.getPeerConnection(peerId));
    }
    /**
     * Fires when an RTCPeerConnection is lost
     *
     * @param {string} peerId
     * @memberof WebRTC
     */
    onDisconnected(peerId: string) {
        let peerConnection = this.getPeerConnection(peerId);
        if (this.onContextDisconnected)
            this.onContextDisconnected(this.findPeerConnection(peerId), peerConnection);
        peerConnection.close();
        this.removePeerConnection(peerId);
    }

    /**
     *Creates an instance of WebRTC.
     * @param {Controller} brokerController
     * @param {*} rtcConfig
     * @param {boolean} [encrypted]
     * @param {string} [cryptoKey]
     * @memberof WebRTC
     */
    constructor(private brokerController: Controller, private rtcConfig: any, e2ee?: IE2EE) {

        if (e2ee) {
            this.isEncrypted = true
            this.e2ee = e2ee;
        } else {
            this.isEncrypted = false;
        }

        this.errors = new Array<any>();
        this.localStreams = new Array<MediaStream>();
        this.dataChannels = new Map<string, DataChannel>();
        this.peers = new Map<string, WebRTCConnection>();

        this.brokerController.on("contextSignal", (signal: any) => {
            let msg = JSON.parse(signal.message);
            switch (msg.type) {
                case "offer":
                    this.onOffer(signal, signal.skipLocalTracks || false);
                    break;
                case "answer":
                    this.onAnswer(signal);
                    break;
                case "candidate":
                    this.onCandidate(signal);
                    break;
            }
        });
        brokerController.on("contextCreated", (peer: PeerConnection) => {
            this.localPeerId = peer.peerId;
            this.context = peer.context;
            this.onContextCreated(peer);
        });
        brokerController.on("contextChanged", (context: any) => {
            this.context = context;
            this.onContextChanged(context);
        });
        brokerController.on("connectTo", (peers: Array<PeerConnection>) => {
            this.onConnectTo(peers);
        });

    }
    /**
     * Add a MediaStreamTrack to remote peers.
     *
     * @param {MediaStreamTrack} track
     * @memberof WebRTC
     */
    addTrackToPeers(track: MediaStreamTrack) {
        this.peers.forEach((p: WebRTCConnection) => {
            let pc = p.RTCPeer;
            pc.onnegotiationneeded = (e) => {
                pc.createOffer()
                    .then(offer => pc.setLocalDescription(offer))
                    .then(() => {
                        let offer = {
                            sender: this.localPeerId,
                            recipient: p.id,
                            message: JSON.stringify(pc.localDescription),
                            skipLocalTracks: true
                        };
                        this.brokerController.invoke("contextSignal", offer)
                    });
            };
            p.RTCPeer.addTrack(track);
        });
    }
    /**
     * Remove a MediaStreamTrack from the remote peers
     *
     * @param {MediaStreamTrack} track
     * @memberof WebRTC
     */
    removeTrackFromPeers(track: MediaStreamTrack) {
        this.peers.forEach((p: WebRTCConnection) => {
            let sender = p.RTCPeer.getSenders().find((sender: RTCRtpSender) => {
                return sender.track.id === track.id;
            });
            p.RTCPeer.removeTrack(sender);
        });
    }
    /**
     * Get the RTCRtpSender's for the specified peer.
     *
     * @param {string} peerId
     * @returns {Array<RTCRtpSender>}
     * @memberof WebRTC
     */
    getRtpSenders(peerId: string): Array<RTCRtpSender> {
        if (!this.peers.has(peerId)) throw "Cannot find the peer"
        return this.peers.get(peerId).RTCPeer.getSenders();
    }
    /**
     * Get rhe RTCRtpReceiver's for the spcified peer.
     *
     * @param {string} peerId
     * @returns {Array<RTCRtpReceiver>}
     * @memberof WebRTC
     */
    getRtpReceivers(peerId: string): Array<RTCRtpReceiver> {
        if (!this.peers.has(peerId)) throw "Cannot find the peer"
        return this.peers.get(peerId).RTCPeer.getReceivers();
    }
    /**
     * Set video and audio bandwidth constraints.
     *
     * @param {number} videobandwidth
     * @param {number} audiobandwidth
     * @memberof WebRTC
     */
    setBandwithConstraints(videobandwidth: number, audiobandwidth: number) {
        this.bandwidthConstraints = new BandwidthConstraints(videobandwidth, audiobandwidth);
    }
    private setMediaBitrates(sdp: string): string {
        return this.setMediaBitrate(this.setMediaBitrate(sdp, "video", this.bandwidthConstraints.videobandwidth), "audio", this.bandwidthConstraints.audiobandwidth);
    }
    private setMediaBitrate(sdp: string, media: string, bitrate: number): string {
        let lines = sdp.split("\n");
        let line = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].indexOf("m=" + media) === 0) {
                line = i;
                break;
            }
        }
        if (line === -1) {
            return sdp;
        }
        line++;
        while (lines[line].indexOf("i=") === 0 || lines[line].indexOf("c=") === 0) {
            line++;
        }
        if (lines[line].indexOf("b") === 0) {
            lines[line] = "b=AS:" + bitrate;
            return lines.join("\n");
        }
        var newLines = lines.slice(0, line);
        newLines.push("b=AS:" + bitrate);
        newLines = newLines.concat(lines.slice(line, lines.length));
        return newLines.join("\n");
    }
    /**
     * Create a new DataChannel 
     *
     * @param {string} name
     * @returns {DataChannel}
     * @memberof WebRTC
     */
    createDataChannel(name: string): DataChannel {
        let channel = new DataChannel(name);
        this.dataChannels.set(name, channel);
        return channel;
    }
    /**
     * Remove the DataChannel
     *
     * @param {string} name
     * @memberof WebRTC
     */
    removeDataChannel(name: string) {
        this.dataChannels.delete(name);
    }
    private addError(err: any) {
        this.onError(err);
    }
    private onCandidate(event: any) {
        let msg = JSON.parse(event.message);
        let candidate = msg.iceCandidate;
        let pc = this.getPeerConnection(event.sender);
        pc.addIceCandidate(new RTCIceCandidate(candidate)).then(() => {
        }).catch((err) => {
            this.addError(err);
        });
    }
    private onAnswer(event: any) {
        let pc = this.getPeerConnection(event.sender);
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message))).then((p) => {
        }).catch((err) => {
            this.addError(err);
        });
    }



    private onOffer(event: any, skipLocalTracks: boolean) {
        let pc = this.getPeerConnection(event.sender);

        if (!skipLocalTracks) {
            this.localStreams.forEach((stream: MediaStream) => {
                stream.getTracks().forEach((track) => {
                    let rtpSender = pc.addTrack(track, stream);
                    if (this.isEncrypted) {
                        let streams = (rtpSender as any).createEncodedStreams();
                        streams.readableStream
                            .pipeThrough(new TransformStream({
                                transform: this.e2ee.encode.bind(this.e2ee),
                            }))
                            .pipeTo(streams.writableStream);
                    }
                });
            });
        }
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message)));
        pc.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then((description: RTCSessionDescriptionInit) => {
            pc.setLocalDescription(description).then(() => {
                if (this.bandwidthConstraints)
                    description.sdp = this.setMediaBitrates(description.sdp);
                let answer = {
                    sender: this.localPeerId,
                    recipient: event.sender,
                    message: JSON.stringify(description)
                };
                this.brokerController.invoke("contextSignal", answer);
            }).catch((err: any) => this.addError(err));
        }).catch((err: any) => this.addError(err));
    }
    /**
     * Add a local MediaStream to the client
     *
     * @param {*} stream
     * @returns {WebRTC}
     * @memberof WebRTC
     */
    addLocalStream(stream: any): WebRTC {
        this.localStreams.push(stream);
        return this;
    }
    /**
     * Add an iceServer iceServers configuration
     *
     * @param {RTCIceServer} iceServer
     * @returns {WebRTC}
     * @memberof WebRTC
     */
    addIceServer(iceServer: RTCIceServer): WebRTC {
        this.rtcConfig.iceServers.push(iceServer);
        return this;
    }
    private removePeerConnection(id: string) {
        this.peers.delete(id);
    }



    private createPeerConnection(id: string): RTCPeerConnection {

        let config: any

        if (this.isEncrypted) {
            config = this.rtcConfig;
            config.encodedInsertableStreams = true;
            config.forceEncodedVideoInsertableStreams = true;
            config.forceEncodedAudioInsertableStreams = true;

        } else {
            config = this.rtcConfig
        }

        let rtcPeerConnection = new RTCPeerConnection(config);

        rtcPeerConnection.onsignalingstatechange = (state) => { };
        rtcPeerConnection.onicecandidate = (event: any) => {
            if (!event || !event.candidate)
                return;
            if (event.candidate) {
                let msg = {
                    sender: this.localPeerId,
                    recipient: id,
                    message: JSON.stringify({
                        type: 'candidate',
                        iceCandidate: event.candidate
                    })
                };
                this.brokerController.invoke("contextSignal", msg);
            }
        };
        rtcPeerConnection.oniceconnectionstatechange = (event: any) => {
            switch (event.target.iceConnectionState) {
                case "connected":
                    this.onConnected(id);
                    break;
                case "disconnected":
                    this.cleanUp(id);
                    this.onDisconnected(id);
                    break;
            }
        };
        rtcPeerConnection.ontrack = (event: RTCTrackEvent) => {
            const track = event.track;
            const kind = event.track.kind;
            const connection = this.peers.get(id);
            event.track.onended = (e: MediaStreamTrackEvent) => {
                if (this.onRemoteTrackLost) this.onRemoteTrackLost(track, connection, e);
            }
            if (kind === "video" && this.onRemoteVideoTrack) {
                this.onRemoteVideoTrack(track, connection, event)
            } else if (kind === "audio" && this.onRemoteAudioTrack) {
                this.onRemoteAudioTrack(track, connection, event)
            }
            if (this.onRemoteTrack) this.onRemoteTrack(track, connection, event)
        };

        this.dataChannels.forEach((dataChannel: DataChannel) => {
            let pc = new PeerChannel(id, rtcPeerConnection.createDataChannel(dataChannel.label), dataChannel.label);
            dataChannel.addPeerChannel(pc);
            rtcPeerConnection.ondatachannel = (event: RTCDataChannelEvent) => {
                let channel = event.channel;
                channel.onopen = (event: Event) => {
                    this.dataChannels.get(channel.label).onOpen(event, id, channel.label);
                };
                channel.onclose = (event: any) => {
                    this.dataChannels.get(channel.label).removePeerChannel(id);
                    this.dataChannels.get(channel.label).onClose(event, id, channel.label);
                };
                channel.onmessage = (message: MessageEvent) => {
                    this.dataChannels.get(channel.label).onMessage(message);

                };
            };
        });
        return rtcPeerConnection;
    }
    cleanUp(id: string) {
        this.dataChannels.forEach((d: DataChannel) => {
            d.removePeerChannel(id);
        });
    }
    /**
     *  Find a WebRTCConnection based in it's id
     *
     * @param {string} id
     * @returns {WebRTCConnection}
     * @memberof WebRTC
     */
    findPeerConnection(id: string): WebRTCConnection {
        return this.peers.get(id);
    }
    /**
     * Reconnect all Peers
     *
     * @returns {Array<PeerConnection>}
     * @memberof WebRTC
     * @deprecated
     */
    reconnectAll(): Array<PeerConnection> {
        throw "not yet implemeted";
    }
    private getPeerConnection(id: string): RTCPeerConnection {
        let match = this.peers.get(id);
        if (!match) {
            let pc = new WebRTCConnection(id, this.createPeerConnection(id));
            this.peers.set(id, pc);
            return pc.RTCPeer;
        }
        return match.RTCPeer;
    }
    private createOffer(peer: PeerConnection) {
        let peerConnection = this.createPeerConnection(peer.peerId);
        this.localStreams.forEach((stream) => {
            stream.getTracks().forEach((track: MediaStreamTrack) => {
                const rtpSender = peerConnection.addTrack(track, stream);
                if (this.isEncrypted) {
                    let senderStreams = (rtpSender as any).createEncodedStreams();
                    senderStreams.readableStream
                        .pipeThrough(new TransformStream({
                            transform: this.e2ee.encode.bind(this.e2ee),
                        }))
                        .pipeTo(senderStreams.writableStream);
                }
            });
            if (this.onLocalStream)
                this.onLocalStream(stream);
        });
        peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then((description: RTCSessionDescriptionInit) => {
            peerConnection.setLocalDescription(description).then(() => {
                if (this.bandwidthConstraints)
                    description.sdp = this.setMediaBitrates(description.sdp);
                let offer = {
                    sender: this.localPeerId,
                    recipient: peer.peerId,
                    message: JSON.stringify(description)
                };
                this.brokerController.invoke("contextSignal", offer);
            }).catch((err: any) => {
                this.addError(err);
            });
        }).catch((err: any) => {
            this.addError(err);
        });
        return peerConnection;
    }
    /**
     * Close all connections
     *
     * @memberof WebRTC
     */
    disconnect() {
        this.peers.forEach((connection: WebRTCConnection) => {
            connection.RTCPeer.close();
        });
        this.changeContext(Math.random().toString(36).substring(2));
    }
    /**
     * Close the specified PeerConnection
     *
     * @param {string} id
     * @memberof WebRTC
     */
    disconnectPeer(id: string): void {
        let peer = this.findPeerConnection(id);
        peer.RTCPeer.close();
    }
    /**
     * Connect peers
     *
     * @param {Array<PeerConnection>} peerConnections
     * @returns {WebRTC}
     * @memberof WebRTC
     */
    connect(peerConnections: Array<PeerConnection>): WebRTC {
        peerConnections.forEach((peerConnection: PeerConnection) => {
            let pc = new WebRTCConnection(peerConnection.peerId, this.createOffer(peerConnection));
            this.peers.set(peerConnection.peerId, pc);
        });
        return this;
    }
    /**
     * Change context
     * 
     * @param {string} context
     * @returns {WebRTC}
     * @memberof WebRTC
     */
    changeContext(context: string): WebRTC {
        this.brokerController.invoke("changeContext", { context: context });
        return this;
    }
    private connectPeers() {
        this.brokerController.invoke("connectContext", {});
    }
    /**
     * Connect to the context and all it's current cliets
     *
     * @memberof WebRTC
     */
    connectContext() {
        this.connectPeers();
    }
}
