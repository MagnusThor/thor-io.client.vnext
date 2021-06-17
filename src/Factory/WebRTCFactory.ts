import { ThorIOConnection } from './Models/ThorIOConnection';
//import { BandwidthConstraints } from '../Utils/BandwidthConstraints';
import { IE2EE } from '../E2EE/E2EEBase';
import { DataChannel } from '../DataChannels/DataChannel';
import { ContextConnection } from './Models/ContextConnection';
import { Controller } from '../Controller/Controller';
import { PeerChannel } from '../DataChannels/PeerChannel';


import adapter from 'webrtc-adapter';

/**
 *  WebRTC abstraction layer for thor-io.vnext
 *
 * @export
 * @class WebRTCFactory
 */
export class WebRTCFactory {
    public peers: Map<string, ThorIOConnection>;
    public peer: RTCPeerConnection;
    public dataChannels: Map<string, DataChannel>;
    public localPeerId: string;
    public context: string;
    public localStreams: Array<MediaStream>;
   // public bandwidthConstraints: BandwidthConstraints;
    public e2ee: IE2EE;
    public isEncrypted: boolean;

    /**
     * Fires when an error occurs
     *
     * @memberof WebRTCFactoryFactory
     */
    onError: (err: any) => void;
    /**
     * Fires when client connects to broker
     *
     * @memberof WebRTCFactoryFactory
     */
    onContextCreated: (peerConnection: ContextConnection) => void;
    /**
     * Fires when client changes context ,and server confirms
     *
     * @memberof WebRTCFactoryFactory
     */
    onContextChanged: (context: { context: string, peerId: string }) => void;
    /**
     * Fires when a remote audio track is lost
     *
     * @memberof WebRTCFactoryFactory
     */
    onRemoteAudioTrack: (track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void;
    /**
     *  Fires when a remote video track is added
     *
     * @memberof WebRTCFactoryFactory
     */
    onRemoteVideoTrack: (track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void;
    /**
     * FIres when a remote video or audio track is added
     *
     * @memberof WebRTCFactoryFactory
     */
    onRemoteTrack: (track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void;
    /**
     * Fires when a remote track is lost
     *
     * @memberof WebRTCFactoryFactory
     */
    onRemoteTrackLost: (track: MediaStreamTrack, connection: ThorIOConnection, event: MediaStreamTrackEvent) => void
    /**
     * Fires when local MediaStream is added
     *
     * @memberof WebRTCFactoryFactory
     */
    onLocalStream: (stream: MediaStream) => void;
    /**
     * Fires for each WebRTCConnection that connects sucessfully to context and client
     *
     * @memberof WebRTCFactoryFactory
     */
    onContextConnected: (webRTCConnection: ThorIOConnection, rtcPeerConnection: RTCPeerConnection) => void;
    /**
     * Fires when a WebRTCConnection is closed or lost.
     *
     * @memberof WebRTCFactoryFactory
     */
    onContextDisconnected: (webRTCConnection: ThorIOConnection, rtcPeerConnection: RTCPeerConnection) => void;

    private onConnectAll(peerConnections: Array<ContextConnection>) {
        this.connect(peerConnections);
    }

    private onConnected(peerId: string) {
        if (this.onContextConnected)
            this.onContextConnected(this.findPeerConnection(peerId), this.getOrCreateRTCPeerConnection(peerId));
    }
    /**
     * Fires when an RTCPeerConnection is lost
     *
     * @param {string} peerId
     * @memberof WebRTCFactoryFactory
     */
    onDisconnected(peerId: string) {
        let peerConnection = this.getOrCreateRTCPeerConnection(peerId);
        if (this.onContextDisconnected)
            this.onContextDisconnected(this.findPeerConnection(peerId), peerConnection);
        peerConnection.close();
        this.removePeerConnection(peerId);
    }
    /**
     *Creates an instance of WebRTC.
     * @param {Controller} signalingController
     * @param {RTCPeerConnectionConfig} rtcConfig
     * @param {IE2EE} [e2ee]
     * @memberof WebRTCFactoryFactory
     */
    constructor(private signalingController: Controller, private rtcConfig: any, e2ee?: IE2EE) {
        if (e2ee) {
            this.isEncrypted = true
            this.e2ee = e2ee;
        } else {
            this.isEncrypted = false;
        }
        this.localStreams = new Array<MediaStream>();
        this.dataChannels = new Map<string, DataChannel>();
        this.peers = new Map<string, ThorIOConnection>();

        this.signalingController.on("contextSignal", (signal: any) => {
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

        this.signalingController.on("contextCreated", (peer: ContextConnection) => {
            this.localPeerId = peer.peerId;
            this.context = peer.context;
            this.onContextCreated(peer);
        });
        this.signalingController.on("contextChanged", (context: any) => {
            this.context = context;
            this.onContextChanged(context);
        });
        this.signalingController.on("connectTo", (peers: Array<ContextConnection>) => {
            this.onConnectAll(peers);
        });

    }
    /**
     * Add a MediaStreamTrack to remote peers.
     *
     * @param {MediaStreamTrack} track
     * @memberof WebRTCFactoryFactory
     */
    addTrackToPeers(track: MediaStreamTrack) {
        this.peers.forEach((p: ThorIOConnection) => {
            let pc = p.peerConnection;
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
                        this.signalingController.invoke("contextSignal", offer)
                    });
            };


        });
    }
    /**
     * Remove a MediaStreamTrack from the remote peers
     *
     * @param {MediaStreamTrack} track
     * @memberof WebRTCFactoryFactory
     */
    removeTrackFromPeers(track: MediaStreamTrack) {
        this.peers.forEach((p: ThorIOConnection) => {
            let sender = p.getSenders().find((sender: RTCRtpSender) => {
                return sender.track.id === track.id;
            });
            p.peerConnection.removeTrack(sender);
        });
    }
    /**
     * Get the RTCRtpSender's for the specified peer.
     *
     * @param {string} peerId
     * @returns {Array<RTCRtpSender>}
     * @memberof WebRTCFactoryFactory
     */
    getRtpSenders(peerId: string): Array<RTCRtpSender> {
        if (!this.peers.has(peerId)) throw "Cannot find the peer"
        return this.peers.get(peerId).getSenders();
    }
    /**
     * Get rhe RTCRtpReceiver's for the specified peer.
     *
     * @param {string} peerId
     * @returns {Array<RTCRtpReceiver>}
     * @memberof WebRTCFactoryFactory
     */
    getRtpReceivers(peerId: string): Array<RTCRtpReceiver> {
        if (!this.peers.has(peerId)) throw "Cannot find the peer"
        return this.peers.get(peerId).getReceivers();
    }
    // /**
    //  * Set video and audio bandwidth constraints.
    //  *
    //  * @param {number} videobandwidth
    //  * @param {number} audiobandwidth
    //  * @memberof WebRTCFactoryFactory
    //  */
    // setBandwithConstraints(videobandwidth: number, audiobandwidth: number) {
    //     this.bandwidthConstraints = new BandwidthConstraints(videobandwidth, audiobandwidth);
    // }

    // private setMediaBitrates(sdp: string): string {
    //     return this.setMediaBitrate(this.setMediaBitrate(sdp, "video", this.bandwidthConstraints.videobandwidth), "audio", this.bandwidthConstraints.audiobandwidth);
    // }

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
     * @memberof WebRTCFactoryFactory
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
     * @memberof WebRTCFactoryFactory
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
        let pc = this.getOrCreateRTCPeerConnection(event.sender);
        pc.addIceCandidate(new RTCIceCandidate(candidate)).then(() => {
        }).catch((err) => {
            this.addError(err);
        });
    }
    private onAnswer(event: any) {
        let pc = this.getOrCreateRTCPeerConnection(event.sender);
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message))).then((p) => {
        }).catch((err) => {
            this.addError(err);
        });
    }

    private onOffer(event: any, skipLocalTracks: boolean) {
        let pc = this.getOrCreateRTCPeerConnection(event.sender);
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
               
                // if (this.bandwidthConstraints)
                //     description.sdp = this.setMediaBitrates(description.sdp);
               
                    let answer = {
                    sender: this.localPeerId,
                    recipient: event.sender,
                    message: JSON.stringify(description)
                };
                this.signalingController.invoke("contextSignal", answer);
            }).catch((err: any) => this.addError(err));
        }).catch((err: any) => this.addError(err));
    }

    /**
     * Get outbound RTP stats for each all PeerConnection's RTP senders.
     *
     * @memberof WebRTCFactory
     */
    getStatsFromPeers() {
        this.peers.forEach((p: ThorIOConnection) => {
            let sender = p.getSenders().find((sender: RTCRtpSender) => {
                sender.getStats().then(res => {
                    res.forEach(report => {
                        let bytes;
                        let headerBytes;
                        let packets;
                        if (report.type === 'outbound-rtp') {
                            if (report.isRemote) {
                                return;
                            }
                            const timestamp = report.timestamp;
                            bytes = report.bytesSent;
                            headerBytes = report.headerBytesSent;
                            packets = report.packetsSent;
                        }
                    });
                });
            });
        });
    }
    /**
     * apply bandwith constraints all PeerConnection's RTPSenders.
     *
     * @param {number} bandwidth
     * @memberof WebRTCFactory
     */
    applyBandwithConstraints(bandwidth: number) {
        this.peers.forEach((p: ThorIOConnection) => {
            const sender = p.getSenders().find((sender: RTCRtpSender) => {
                const parameters = sender.getParameters() as any;
                if (!parameters.encodings) {
                    parameters.encodings = [{}];
                }
                if (parameters.encodings[0]) {
                    parameters.encodings[0].maxBitrate = bandwidth * 1000;
                    sender.setParameters(parameters).then(() => {
                        console.log("apply bandwith constraints successfully applied. ")
                    }).catch(e => {
                        this.onError(e);
                    });
                }
            });
        });
    }

    async setVideoConstraints(height: number, frameRate: number): Promise<void> {
        this.peers.forEach((p: ThorIOConnection) => {
            let sender = p.getSenders().find((sender: RTCRtpSender) => {

            });
        });

        //await sender.track.applyConstraints({ height });

    }
    /**
     * Add a local MediaStream to the client
     *
     * @param {MediaStream} stream
     * @returns {WebRTCFactory}
     * @memberof WebRTCFactoryFactory
     */
    addLocalStream(stream: MediaStream): WebRTCFactory {
        this.localStreams.push(stream);
        return this;
    }
    /**
     * Add an iceServer iceServers configuration
     *
     * @param {RTCIceServer} iceServer
     * @returns {WebRTCFactory}
     * @memberof WebRTCFactoryFactory
     */
    addIceServer(iceServer: RTCIceServer): WebRTCFactory {
        this.rtcConfig.iceServers.push(iceServer);
        return this;
    }

    removePeerConnection(id: string) {
        this.peers.delete(id);
    }


    private createRTCPeerConnection(id: string): RTCPeerConnection {

        let config: any; //RTCPeerConnectionConfig;

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
                this.signalingController.invoke("contextSignal", msg);
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
     * @returns {ThorIOConnection}
     * @memberof WebRTCFactoryFactory
     */
    findPeerConnection(id: string): ThorIOConnection {
        return this.peers.get(id);
    }
    /**
     * Reconnect all Peers
     *
     * @returns {Array<ContextConnection>}
     * @memberof WebRTCFactoryFactory
     * @deprecated
     */
    reconnectAll(): Array<ContextConnection> {
        throw "not yet implemeted";
    }
    private getOrCreateRTCPeerConnection(id: string): RTCPeerConnection {
        let match = this.peers.get(id);
        if (!match) {
            let pc = new ThorIOConnection(id, this.createRTCPeerConnection(id));
            this.peers.set(id, pc);
            return pc.peerConnection;
        }
        return match.peerConnection;
    }
    private createOffer(peer: ContextConnection) {
        let peerConnection = this.createRTCPeerConnection(peer.peerId);
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
               
                // if (this.bandwidthConstraints)
                //     description.sdp = this.setMediaBitrates(description.sdp);

                let offer = {
                    sender: this.localPeerId,
                    recipient: peer.peerId,
                    message: JSON.stringify(description)
                };
                this.signalingController.invoke("contextSignal", offer);
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
     * @memberof WebRTCFactoryFactory
     */
    disconnect() {
        this.peers.forEach((connection: ThorIOConnection) => {
            connection.peerConnection.close();
        });
        this.changeContext(Math.random().toString(36).substring(2));
    }
    /**
     * Close the specified PeerConnection
     *
     * @param {string} id
     * @memberof WebRTCFactoryFactory
     */
    disconnectPeer(id: string): void {
        let peer = this.findPeerConnection(id);
        peer.peerConnection.close();
    }
    /**
     * Connect all Peers
     *
     * @param {Array<ContextConnection>} peerConnections
     * @memberof WebRTCFactoryFactory
     */
    connect(peerConnections: Array<ContextConnection>): void {
        peerConnections.forEach((peerConnection: ContextConnection) => {
            this.connectTo(peerConnection)
        });
    }
    connectTo(peerConnection: ContextConnection): void {
        let pc = new ThorIOConnection(peerConnection.peerId, this.createOffer(peerConnection));
        if (!this.peers.has(peerConnection.peerId))
            this.peers.set(peerConnection.peerId, pc);
    }
    /**
     * Change context
     * 
     * @param {string} context
     * @returns {WebRTCFactory}
     * @memberof WebRTCFactoryFactory
     */
    changeContext(context: string): WebRTCFactory {
        this.signalingController.invoke("changeContext", { context: context });
        return this;
    }
    private connectPeers() {
        this.signalingController.invoke("connectContext", {});
    }
    /**
     * Connect to the context and all it's current ContextConnections)
     *
     * @memberof WebRTCFactoryFactory
     */
    connectContext() {
        this.connectPeers();
    }

}
