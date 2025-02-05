import { Controller } from '../Controller/Controller';
import { DataChannel } from '../DataChannels/DataChannel';
import { PeerChannel } from '../DataChannels/PeerChannel';
import { IE2EE } from '../E2EE/E2EEBase';
import { ContextConnection } from '../Models/ContextConnection';
import { ThorIOConnection } from '../Models/ThorIOConnection';

/**
 *  WebRTC abstraction layer for thor-io.vnext
 *
 * @export
 * @class WebRTCFactory
 */
export class WebRTCFactory {
    public peers: Map<string, ThorIOConnection>;
    public peer: RTCPeerConnection | undefined;
    public dataChannels: Map<string, DataChannel>;
    public localPeerId: string | undefined;
    public context!: string;
    public localStreams: Array<MediaStream>;

    public e2ee: IE2EE | undefined;
    public isEncrypted: boolean;

    /**
     * Fires when an error occurs
     *
     * @param {any} err - The error object
     */
    onError: ((err: any) => (err: any) => void) | undefined;

    /**
     * Fires when client connects to broker
     *
     * @param {ContextConnection} peerConnection - The context connection
     */
    onContextCreated: ((peerConnection: ContextConnection) => void) | undefined;

    /**
     * Fires when client changes context, and server confirms
     *
     * @param {Object} context - The context object
     * @param {string} context.context - The context string
     * @param {string} context.peerId - The peer ID
     */
    onContextChanged: ((context: { context: string; peerId: string; }) => void) | undefined;

    /**
     * Fires when a remote audio track is lost
     *
     * @param {MediaStreamTrack} track - The remote media stream track
     * @param {ThorIOConnection} connection - The connection associated with the track
     * @param {RTCTrackEvent} event - The RTC track event
     */
    onRemoteAudioTrack: ((track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void) | undefined;

    /**
     * Fires when a remote video track is added
     *
     * @param {MediaStreamTrack} track - The remote media stream track
     * @param {ThorIOConnection} connection - The connection associated with the track
     * @param {RTCTrackEvent} event - The RTC track event
     */
    onRemoteVideoTrack: ((track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void) | undefined;

    /**
     * Fires when a remote track is added
     *
     * @param {MediaStreamTrack} track - The remote media stream track
     * @param {ThorIOConnection} connection - The connection associated with the track
     * @param {RTCTrackEvent} event - The RTC track event
     */
    onRemoteTrack: ((track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => void) | undefined;

    /**
     * Fires when a remote track is lost
     *
     * @param {MediaStreamTrack} track - The remote media stream track
     * @param {ThorIOConnection} connection - The connection associated with the track
     * @param {MediaStreamTrackEvent} event - The media stream track event
     */
    onRemoteTrackLost: ((track: MediaStreamTrack, connection: ThorIOConnection, event: MediaStreamTrackEvent) => void) | undefined;

    /**
     * Fires when local MediaStream is added
     *
     * @param {MediaStream} stream - The local media stream
     */
    onLocalStream: ((stream: MediaStream) => void) | undefined;

    /**
     * Fires for each WebRTCConnection that connects successfully to context and client
     *
     * @param {ThorIOConnection} webRTCConnection - The WebRTC connection
     * @param {RTCPeerConnection} rtcPeerConnection - The RTC peer connection
     */
    onContextConnected: ((webRTCConnection: ThorIOConnection, rtcPeerConnection: RTCPeerConnection) => void) | undefined;

    /**
     * Fires when a WebRTCConnection is closed or lost.
     *
     * @param {ThorIOConnection} webRTCConnection - The WebRTC connection
     * @param {RTCPeerConnection} rtcPeerConnection - The RTC peer connection
     */
    onContextDisconnected: ((webRTCConnection: ThorIOConnection, rtcPeerConnection: RTCPeerConnection) => void) | undefined;

    private onConnectAll(peerConnections: Array<ContextConnection>) {
        this.connect(peerConnections);
    }

    private onConnected(peerId: string) {
        if (this.onContextConnected)
            this.onContextConnected(this.findPeerConnection(peerId)!, this.getOrCreateRTCPeerConnection(peerId));
    }

    /**
     * Fires when an RTCPeerConnection is lost
     *
     * @param {string} peerId - The peer ID
     */
    onDisconnected(peerId: string) {
        let peerConnection = this.getOrCreateRTCPeerConnection(peerId);
        if (this.onContextDisconnected)
            this.onContextDisconnected(this.findPeerConnection(peerId)!, peerConnection);
        peerConnection.close();
        this.removePeerConnection(peerId);
    }

    /**
     * Creates an instance of WebRTCFactory.
     * 
     * @param {Controller} signalingController - The signaling controller
     * @param {RTCPeerConnectionConfig} rtcConfig - The RTC configuration
     * @param {IE2EE} [e2ee] - The end-to-end encryption instance
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
            this.onContextCreated!(peer);
        });
        this.signalingController.on("contextChanged", (context: any) => {
            this.context = context;
            this.onContextChanged!(context);
        });
        this.signalingController.on("connectTo", (peers: Array<ContextConnection>) => {
            this.onConnectAll(peers);
        });

    }

    /**
     * Add a MediaStreamTrack to remote peers.
     *
     * @param {MediaStreamTrack} track - The media stream track
     */
    addTrackToPeers(track: MediaStreamTrack) {
        this.peers.forEach((p: ThorIOConnection) => {
            const pc = p.peerConnection;
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
     * @param {MediaStreamTrack} track - The media stream track
     */
    removeTrackFromPeers(track: MediaStreamTrack) {
        this.peers.forEach((p: ThorIOConnection) => {
            const sender = p.getSenders().find((sender: RTCRtpSender) => {
                return sender.track!.id === track.id;
            });
            if (sender)
                p.peerConnection.removeTrack(sender);
        });
    }

    /**
     * Get the RTCRtpSender's for the specified peer.
     *
     * @param {string} peerId - The peer ID
     * @returns {Array<RTCRtpSender>} The array of RTCRtpSenders
     */
    getRtpSenders(peerId: string): Array<RTCRtpSender> | undefined {
        if (!this.peers.has(peerId)) throw "Cannot find the peer"
        return this.peers.get(peerId)!.getSenders();
    }

    /**
     * Get the RTCRtpReceiver's for the specified peer.
     *
     * @param {string} peerId - The peer ID
     * @returns {Array<RTCRtpReceiver>} The array of RTCRtpReceivers
     */
    getRtpReceivers(peerId: string): Array<RTCRtpReceiver> {
        if (!this.peers.has(peerId)) throw "Cannot find the peer"
        return this.peers.get(peerId)!.getReceivers();
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
     * Create a new DataChannel.
     *
     * @param {string} name - The name of the DataChannel
     * @returns {DataChannel} The created DataChannel
     */
    createDataChannel(name: string): DataChannel {
        const channel = new DataChannel(name);
        this.dataChannels.set(name, channel);
        return channel;
    }

    /**
     * Remove the DataChannel.
     *
     * @param {string} name - The name of the DataChannel to remove
     */
    removeDataChannel(name: string): void {
        this.dataChannels.delete(name);
    }

    private addError(err: any) {
        if (this.onError)
            this.onError(err);

    }

    private onCandidate(event: any) {
        const msg = JSON.parse(event.message);
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
                                transform: this.e2ee!.encode.bind(this.e2ee),
                            }))
                            .pipeTo(streams.writableStream);
                    }
                });
            });
        }
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message)));
        const rtcAnswer = { offerToReceiveAudio: true, offerToReceiveVideo: true } as RTCAnswerOptions
        pc.createAnswer(rtcAnswer).then((description: RTCSessionDescriptionInit) => {
            pc.setLocalDescription(description).then(() => {
                const answer = {
                    sender: this.localPeerId,
                    recipient: event.sender,
                    message: JSON.stringify(description)
                };
                this.signalingController.invoke("contextSignal", answer);
            }).catch((err: any) => this.addError(err));
        }).catch((err: any) => this.addError(err));
    }

    /**
     * Apply MediaTrack constraints to each frame / peer within buffer 
     *
     * @param {MediaTrackConstraints} mtc - The media track constraints
     * @return {Promise<any>} A promise that resolves when constraints are applied
     */
    applyVideoConstraints(mtc: MediaTrackConstraints): Promise<any> {
        let work = Array.from(this.peers.values()).map(v => {
            return v.getSenders().map(sender => {
                return sender.track!.applyConstraints(mtc);
            })
        });
        return Promise.all(work);
    }

    /**
     * Apply bandwidth constraints to all PeerConnection's RTPSenders.
     *
     * @param {number} bandwidth - The bandwidth in kbps
     */
    applyBandwithConstraints(bandwidth: number): void {
        this.peers.forEach((p: ThorIOConnection) => {
            p.getSenders().find((sender: RTCRtpSender) => {
                const parameters = sender.getParameters() as any;
                if (!parameters.encodings) {
                    parameters.encodings = [{}];
                }
                if (parameters.encodings[0]) {
                    parameters.encodings[0].maxBitrate = bandwidth * 1000;
                    sender.setParameters(parameters).then(() => {
                        console.log("apply bandwith constraints successfully applied.")
                    }).catch(e => {
                        this.onError!(e);
                    });
                }
            });
        });
    }

    /**
     * Add a local MediaStream to the client
     *
     * @param {MediaStream} stream - The local media stream
     * @returns {WebRTCFactory} The WebRTCFactory instance
     */
    addLocalStream(stream: MediaStream): WebRTCFactory {
        this.localStreams.push(stream);
        return this;
    }

    /**
     * Add an iceServer iceServers configuration
     *
     * @param {RTCIceServer} iceServer - The ice server configuration
     * @returns {WebRTCFactory} The WebRTCFactory instance
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

            event.track.onended = (e: any) => {
                if (this.onRemoteTrackLost) this.onRemoteTrackLost(track, connection!, e);
            }

            if (kind === "video" && this.onRemoteVideoTrack) {
                this.onRemoteVideoTrack(track, connection!, event)
            } else if (kind === "audio" && this.onRemoteAudioTrack) {
                this.onRemoteAudioTrack(track, connection!, event)
            }
            if (this.onRemoteTrack) this.onRemoteTrack(track, connection!, event)
        };

        this.dataChannels.forEach((dataChannel: DataChannel) => {
            let pc = new PeerChannel(id, rtcPeerConnection.createDataChannel(dataChannel.label), dataChannel.label);
            dataChannel.addPeerChannel(pc);
            rtcPeerConnection.ondatachannel = (event: RTCDataChannelEvent) => {
                let channel = event.channel;
                channel.onopen = (event: Event) => {
                    this.dataChannels.get(channel.label)!.onOpen(event, id, channel.label);
                };
                channel.onclose = (event: any) => {
                    this.dataChannels.get(channel.label)!.removePeerChannel(id);
                    this.dataChannels.get(channel.label)!.onClose(event, id, channel.label);
                };
                channel.onmessage = (message: MessageEvent) => {
                    this.dataChannels.get(channel.label)!.onMessage(message);

                };
            };
        });
        return rtcPeerConnection;
    }

    private cleanUp(id: string) {
        this.dataChannels.forEach((d: DataChannel) => {
            d.removePeerChannel(id);
        });
    }

    /**
     * Find a WebRTCConnection based on its ID
     *
     * @param {string} id - The peer ID
     * @returns {ThorIOConnection | undefined} The ThorIOConnection instance or undefined
     */
    findPeerConnection(id: string): ThorIOConnection | undefined {
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
                            transform: this.e2ee!.encode.bind(this.e2ee),
                        }))
                        .pipeTo(senderStreams.writableStream);
                }
            });
            if (this.onLocalStream)
                this.onLocalStream(stream);
        });
        peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then((description: RTCSessionDescriptionInit) => {
            peerConnection.setLocalDescription(description).then(() => {
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
        if (peer)
            peer.peerConnection.close();
    }

    connect(peerConnections: Array<ContextConnection>): void {
        peerConnections.forEach((peerConnection: ContextConnection) => {
            this.connectTo(peerConnection)
        });
    }
 
    /**
     * Establishes connections to a list of peer connections.
     *
     * @param {ContextConnection[]} peerConnections - An array of peer connections to connect to.
     * @returns {void}
     */
    connectTo(peerConnection: ContextConnection): void {
        let pc = new ThorIOConnection(peerConnection.peerId, this.createOffer(peerConnection));
        if (!this.peers.has(peerConnection.peerId))
            this.peers.set(peerConnection.peerId, pc);
    }
  
    /**
     * Changes the signaling context for the WebRTC connection.
     * This method invokes the "changeContext" command on the signaling controller
     * with the provided context.
     *
     * @param context - The new context to be set for the WebRTC connection.
     * @returns The current instance of WebRTCFactory for method chaining.
     */
    changeContext(context: string): WebRTCFactory {
        this.signalingController.invoke("changeContext", { context: context });
        return this;
    }
    private connectPeers() {
        this.signalingController.invoke("connectContext", {});
    }
  
    /**
     * Establishes a connection context by connecting to peers.
     * This method initializes the peer connections required for WebRTC communication.
     */
    connectContext() {
        this.connectPeers();
    }

}
