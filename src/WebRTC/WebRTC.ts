import { PeerConnection } from "./PeerConnection";
import { WebRTCConnection } from "./WebRTCConnection";
import { PeerChannel } from "./PeerChannel";
import { DataChannel } from "./DataChannel";
import { BandwidthConstraints } from "./BandwidthConstraints";
import { Controller } from "../Controller";
/**
 *
 *
 * @export
 * @class WebRTC
 */
export class WebRTC {
    public Peers: Map<string,WebRTCConnection>;
    public Peer: RTCPeerConnection;
    public DataChannels: Map<string,DataChannel>;
    public LocalPeerId: string;
    public Context: string;
    public LocalStreams: Array<any>;
    public Errors: Array<any>;
    public bandwidthConstraints: BandwidthConstraints;   
    /**
     * Fires when an error occurs
     *
     * @memberof WebRTC
     */
    OnError: (err: any) => void;  

    /**
     * Fires when client connects to broker
     *
     * @memberof WebRTC
     */
    OnContextCreated: (peerConnection: PeerConnection) => void;  
    /**
     * Fires when client changes context ,and server confirms
     *
     * @memberof WebRTC
     */
    OnContextChanged: (context: string) => void;
   
    /**
     * When a remote Peer adds an MediaTrack 1-n
     *
     * @memberof WebRTC
     */
    OnRemoteTrack: (track: MediaStreamTrack, connection: WebRTCConnection) => void;  
    /**
     * Fires when local MediaStream is added
     *
     * @memberof WebRTC
     */
    OnLocalStream: (stream: MediaStream) => void;   
    /**
     * Fires for each WebRTCConnection that connects sucessfully to context and client
     *
     * @memberof WebRTC
     */
    OnContextConnected: (webRTCConnection: WebRTCConnection, rtcPeerConnection: RTCPeerConnection) => void;
    /**
     * Fires when a WebRTCConnectioni is closed or lost.
     *
     * @memberof WebRTC
     */
    OnContextDisconnected: (webRTCConnection: WebRTCConnection, rtcPeerConnection: RTCPeerConnection) => void;

    private onConnectTo(peerConnections: Array<PeerConnection>) {
        this.Connect(peerConnections);
    }

    private onConnected(peerId: string) {
        this.OnContextConnected(this.findPeerConnection(peerId), this.getPeerConnection(peerId));
    }
    /**
     * Fires when an RTCPeerConnection is lost
     *
     * @param {string} peerId
     * @memberof WebRTC
     */
    OnDisconnected(peerId: string) {
        let peerConnection = this.getPeerConnection(peerId);
        this.OnContextDisconnected(this.findPeerConnection(peerId), peerConnection);
        peerConnection.close();
        this.removePeerConnection(peerId);
    }
    /**
     *Creates an instance of WebRTC.
     * @param {Controller} brokerController
     * @param {*} rtcConfig
     * @memberof WebRTC
     */
    constructor(private brokerController: Controller, private rtcConfig: any) {
        this.Errors = new Array<any>();
        this.LocalStreams = new Array<MediaStream>();
        this.DataChannels = new Map<string,DataChannel>();
        this.Peers = new Map<string,WebRTCConnection>();
        
        this.brokerController.On("contextSignal", (signal: any) => {
            let msg = JSON.parse(signal.message);
            switch (msg.type) {
                case "offer":
                    this.onOffer(signal);
                    break;
                case "answer":
                    this.onAnswer(signal);
                    break;
                case "candidate":
                    this.onCandidate(signal);
                    break;               
            }
        });

        brokerController.On("contextCreated", (peer: PeerConnection) => {
            this.LocalPeerId = peer.peerId;
            this.Context = peer.context;
            this.OnContextCreated(peer);
        });
        brokerController.On("contextChanged", (context: string) => {
            this.Context = context;
            this.OnContextChanged(context);
        });
        brokerController.On("connectTo", (peers: Array<PeerConnection>) => {
            this.onConnectTo(peers);
        });


       
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
    CreateDataChannel(name: string): DataChannel {
        let channel = new DataChannel(name);
        this.DataChannels.set(name,channel);        
        return channel;
    }
    /**
     * Remove the DataChannel
     *
     * @param {string} name
     * @memberof WebRTC
     */
    RemoveDataChannel(name: string) {       
        this.DataChannels.delete(name);
    }
    private addError(err: any) {
        this.OnError(err);
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
    private onAnswer(event:any) {
        let pc = this.getPeerConnection(event.sender);
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message))).then((p) => {
        }).catch((err) => {
            this.addError(err);
        });
    }
    private onOffer(event:any) {
        let pc = this.getPeerConnection(event.sender);
        this.LocalStreams.forEach((stream: MediaStream) => {
            stream.getTracks().forEach(function (track) {
                pc.addTrack(track, stream);
            });
        });
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message)));
        pc.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then((description: RTCSessionDescriptionInit) => {
            pc.setLocalDescription(description).then(() => {
                if (this.bandwidthConstraints)
                    description.sdp = this.setMediaBitrates(description.sdp);
                let answer = {
                    sender: this.LocalPeerId,
                    recipient: event.sender,
                    message: JSON.stringify(description)
                };
                this.brokerController.Invoke("contextSignal", answer);
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
    AddLocalStream(stream: any): WebRTC {
        this.LocalStreams.push(stream);
        return this;
    }
    /**
     * Add an iceServer iceServers configuration
     *
     * @param {RTCIceServer} iceServer
     * @returns {WebRTC}
     * @memberof WebRTC
     */
    AddIceServer(iceServer: RTCIceServer): WebRTC {
        this.rtcConfig.iceServers.push(iceServer);
        return this;
    }
    private removePeerConnection(id: string) {
        this.Peers.delete(id);        
    }
    private createPeerConnection(id: string): RTCPeerConnection {
        let rtcPeerConnection = new RTCPeerConnection(this.rtcConfig);
        rtcPeerConnection.onsignalingstatechange = (state) => { };
        rtcPeerConnection.onicecandidate = (event: any) => {
            if (!event || !event.candidate)
                return;
            if (event.candidate) {
                let msg = {
                    sender: this.LocalPeerId,
                    recipient: id,
                    message: JSON.stringify({
                        type: 'candidate',
                        iceCandidate: event.candidate
                    })
                };
                this.brokerController.Invoke("contextSignal", msg);
            }
        };
        rtcPeerConnection.oniceconnectionstatechange = (event: any) => {
            switch (event.target.iceConnectionState) {
                case "connected":
                    this.onConnected(id);
                    break;
                case "disconnected":
                    this.OnDisconnected(id);
                    break;
            }
            ;
        };
        rtcPeerConnection.ontrack = (event: RTCTrackEvent) => {            
            let connection = this.Peers.get(id);
            connection.stream.addTrack(event.track);
            this.OnRemoteTrack(event.track, connection);
        };
        this.DataChannels.forEach((dataChannel: DataChannel) => {
            let pc = new PeerChannel(id, rtcPeerConnection.createDataChannel(dataChannel.Name), dataChannel.Name);
            dataChannel.addPeerChannel(pc);
            rtcPeerConnection.ondatachannel = (event: RTCDataChannelEvent) => {
                let channel = event.channel;
                channel.onopen = (event: Event) => {
                    dataChannel.OnOpen(event, id);
                };
                channel.onclose = (event: any) => {
                    dataChannel.removePeerChannel(id);
                    dataChannel.OnClose(event, id);
                };
                channel.onmessage = (message: MessageEvent) => {
                    dataChannel.onMessage(message);
                };
            };
        });
        return rtcPeerConnection;
    }
    /**
     *  Find a WebRTCConnection based in it's id
     *
     * @param {string} id
     * @returns {WebRTCConnection}
     * @memberof WebRTC
     */
    findPeerConnection(id: string): WebRTCConnection {
        return this.Peers.get(id);
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
        let match = this.Peers.get(id);
        if (!match) {
            let pc = new WebRTCConnection(id, this.createPeerConnection(id));
            this.Peers.set(id,pc);
            return pc.RTCPeer;
        }
        return match.RTCPeer;
    }
    private createOffer(peer: PeerConnection) {
        let peerConnection = this.createPeerConnection(peer.peerId);
        this.LocalStreams.forEach((stream) => {         
            stream.getTracks().forEach( (track:MediaStreamTrack) => {
                peerConnection.addTrack(track, stream);
            });
            this.OnLocalStream(stream);
        });
        peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then((description: RTCSessionDescriptionInit) => {
            peerConnection.setLocalDescription(description).then(() => {
                if (this.bandwidthConstraints)
                    description.sdp = this.setMediaBitrates(description.sdp);
                let offer = {
                    sender: this.LocalPeerId,
                    recipient: peer.peerId,
                    message: JSON.stringify(description)
                };
                this.brokerController.Invoke("contextSignal", offer);
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
    Disconnect() {
        this.Peers.forEach((connection: WebRTCConnection) => {
            connection.RTCPeer.close();
        });
        this.ChangeContext(Math.random().toString(36).substring(2));
    }
    /**
     * Close the specified PeerConnection
     *
     * @param {string} id
     * @memberof WebRTC
     */
    DisconnectPeer(id: string): void {
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
    Connect(peerConnections: Array<PeerConnection>): WebRTC {
        peerConnections.forEach((peerConnection: PeerConnection) => {
            let pc = new WebRTCConnection(peerConnection.peerId, this.createOffer(peerConnection));
            this.Peers.set(peerConnection.peerId,pc);
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
    ChangeContext(context: string): WebRTC {
        this.brokerController.Invoke("changeContext", { context: context });
        return this;
    }   
    private ConnectPeers() {
        this.brokerController.Invoke("connectContext", {});
    }
    /**
     * Connect to the context and all it's current cliets
     *
     * @memberof WebRTC
     */
    ConnectContext() {
        this.ConnectPeers();
    }
}
