import { PeerConnection } from "./PeerConnection";
import { WebRTCConnection } from "./WebRTCConnection";
import { PeerChannel } from "./PeerChannel";
import { DataChannel } from "./DataChannel";
import { BandwidthConstraints } from "./BandwidthConstraints";
import { Proxy } from "../Proxy";

export class WebRTC {
    public Peers: Array<WebRTCConnection>;
    public Peer: RTCPeerConnection;
    public DataChannels: Array<DataChannel>;
    public LocalPeerId: string;
    public Context: string;
    public LocalStreams: Array<any>;
    public Errors: Array<any>;
    public bandwidthConstraints: BandwidthConstraints;
    constructor(private brokerProxy: Proxy, private rtcConfig: any) {
        this.Errors = new Array<any>();
        this.DataChannels = new Array<DataChannel>();
        this.Peers = new Array<any>();
        this.LocalStreams = new Array<any>();
        this.signalHandlers();
        brokerProxy.On("contextCreated", (peer: PeerConnection) => {
            this.LocalPeerId = peer.peerId;
            this.Context = peer.context;
            this.OnContextCreated(peer);
        });
        brokerProxy.On("contextChanged", (context: string) => {
            this.Context = context;
            this.OnContextChanged(context);
        });
        brokerProxy.On("connectTo", (peers: Array<PeerConnection>) => {
            this.OnConnectTo(peers);
        });
    }
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
    CreateDataChannel(name: string): DataChannel {
        let channel = new DataChannel(name);
        this.DataChannels.push(channel);
        return channel;
    }
    RemoveDataChannel(name: string) {
        var match = this.DataChannels.find((p: DataChannel) => { return p.Name === name; });
        this.DataChannels.splice(this.DataChannels.indexOf(match), 1);
    }
    private signalHandlers() {
        this.brokerProxy.On("contextSignal", (signal: any) => {
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
                default:
                    // do op
                    break;
            }
        });
    }
    private addError(err: any) {
        this.OnError(err);
    }
    OnError: (err: any) => void;
    OnContextCreated: (peerConnection: PeerConnection) => void;
    OnContextChanged: (context: string) => void;
    OnRemoteTrack: (track: MediaStreamTrack, connection: WebRTCConnection) => void;
    //  OnRemoteStreamlost:(streamId: string, peerId: string) => void
    OnLocalStream: (stream: MediaStream) => void;
    OnContextConnected: (webRTCConnection: WebRTCConnection, rtcPeerConnection: RTCPeerConnection) => void;
    OnContextDisconnected: (webRTCConnection: WebRTCConnection, rtcPeerConnection: RTCPeerConnection) => void;
    OnConnectTo(peerConnections: Array<PeerConnection>) {
        this.Connect(peerConnections);
    }
    OnConnected(peerId: string) {
        this.OnContextConnected(this.findPeerConnection(peerId), this.getPeerConnection(peerId));
    }
    OnDisconnected(peerId: string) {
        let peerConnection = this.getPeerConnection(peerId);
        this.OnContextDisconnected(this.findPeerConnection(peerId), peerConnection);
        peerConnection.close();
        this.removePeerConnection(peerId);
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
                this.brokerProxy.Invoke("contextSignal", answer);
            }).catch((err: any) => this.addError(err));
        }).catch((err: any) => this.addError(err));
    }
    AddLocalStream(stream: any): WebRTC {
        this.LocalStreams.push(stream);
        return this;
    }
    AddIceServer(iceServer: RTCIceServer): WebRTC {
        this.rtcConfig.iceServers.push(iceServer);
        return this;
    }
    private removePeerConnection(id: string) {
        let connection = this.Peers.find((conn: WebRTCConnection) => {
            return conn.id === id;
        });
        let index = this.Peers.indexOf(connection);
        if (index > -1)
            this.Peers.splice(index, 1);
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
                this.brokerProxy.Invoke("contextSignal", msg);
            }
        };
        rtcPeerConnection.oniceconnectionstatechange = (event: any) => {
            switch (event.target.iceConnectionState) {
                case "connected":
                    this.OnConnected(id);
                    break;
                case "disconnected":
                    this.OnDisconnected(id);
                    break;
            }
            ;
        };
        rtcPeerConnection.ontrack = (event: RTCTrackEvent) => {
            let connection = this.Peers.find((p) => {
                return p.id === id;
            });
            connection.stream.addTrack(event.track);
            this.OnRemoteTrack(event.track, connection);
        };
        this.DataChannels.forEach((dataChannel: DataChannel) => {
            let pc = new PeerChannel(id, rtcPeerConnection.createDataChannel(dataChannel.Name), dataChannel.Name);
            dataChannel.AddPeerChannel(pc);
            rtcPeerConnection.ondatachannel = (event: RTCDataChannelEvent) => {
                let channel = event.channel;
                channel.onopen = (event: Event) => {
                    dataChannel.OnOpen(event, id);
                };
                channel.onclose = (event: any) => {
                    dataChannel.RemovePeerChannel(id);
                    dataChannel.OnClose(event, id);
                };
                channel.onmessage = (message: MessageEvent) => {
                    dataChannel.OnMessage(message);
                };
            };
        });
        return rtcPeerConnection;
    }
    findPeerConnection(id: string): WebRTCConnection {
        let i = this.getPeerIndex(id);
        return this.Peers[i];
    }
    getPeerIndex = function (id: string): number {
        return this.Peers.findIndex(function (pre:any) { return pre.id === id; });
    };
    reconnectAll(): Array<PeerConnection> {
        let peers = this.Peers.map((peer: WebRTCConnection) => {
            let p = new PeerConnection();
            p.peerId = peer.id;
            p.context = this.Context;
            return p;
        });
        this.Peers = new Array<WebRTCConnection>();
        this.Connect(peers);
        return peers;
    }
    private getPeerConnection(id: string): RTCPeerConnection {
        let match = this.Peers.find((connection: WebRTCConnection) => {
            return connection.id === id;
        });
        if (!match) {
            let pc = new WebRTCConnection(id, this.createPeerConnection(id));
            this.Peers.push(pc);
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
                this.brokerProxy.Invoke("contextSignal", offer);
            }).catch((err: any) => {
                this.addError(err);
            });
        }).catch((err: any) => {
            this.addError(err);
        });
        return peerConnection;
    }
    Disconnect() {
        this.Peers.forEach((connection: WebRTCConnection) => {
            connection.RTCPeer.close();
        });
        this.ChangeContext(Math.random().toString(36).substring(2));
    }
    DisconnectPeer(id: string): void {
        let peer = this.findPeerConnection(id);
        peer.RTCPeer.close();
    }
    Connect(peerConnections: Array<PeerConnection>): WebRTC {
        peerConnections.forEach((peerConnection: PeerConnection) => {
            let pc = new WebRTCConnection(peerConnection.peerId, this.createOffer(peerConnection));
            this.Peers.push(pc);
        });
        return this;
    }
    ChangeContext(context: string): WebRTC {
        this.brokerProxy.Invoke("changeContext", { context: context });
        return this;
    }
    ConnectPeers() {
        this.brokerProxy.Invoke("connectContext", {});
    }
    ConnectContext() {
        this.ConnectPeers();
    }
}
