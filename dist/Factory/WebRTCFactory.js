"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebRTCFactory = void 0;
const DataChannel_1 = require("../DataChannels/DataChannel");
const PeerChannel_1 = require("../DataChannels/PeerChannel");
const ThorIOConnection_1 = require("../Models/ThorIOConnection");
class WebRTCFactory {
    onConnectAll(peerConnections) {
        this.connect(peerConnections);
    }
    onConnected(peerId) {
        if (this.onContextConnected)
            this.onContextConnected(this.findPeerConnection(peerId), this.getOrCreateRTCPeerConnection(peerId));
    }
    onDisconnected(peerId) {
        let peerConnection = this.getOrCreateRTCPeerConnection(peerId);
        if (this.onContextDisconnected)
            this.onContextDisconnected(this.findPeerConnection(peerId), peerConnection);
        peerConnection.close();
        this.removePeerConnection(peerId);
    }
    constructor(signalingController, rtcConfig, e2ee) {
        this.signalingController = signalingController;
        this.rtcConfig = rtcConfig;
        if (e2ee) {
            this.isEncrypted = true;
            this.e2ee = e2ee;
        }
        else {
            this.isEncrypted = false;
        }
        this.localStreams = new Array();
        this.dataChannels = new Map();
        this.peers = new Map();
        this.signalingController.on("contextSignal", (signal) => {
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
        this.signalingController.on("contextCreated", (peer) => {
            this.localPeerId = peer.peerId;
            this.context = peer.context;
            this.onContextCreated(peer);
        });
        this.signalingController.on("contextChanged", (context) => {
            this.context = context;
            this.onContextChanged(context);
        });
        this.signalingController.on("connectTo", (peers) => {
            this.onConnectAll(peers);
        });
    }
    addTrackToPeers(track) {
        this.peers.forEach((p) => {
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
                    this.signalingController.invoke("contextSignal", offer);
                });
            };
        });
    }
    removeTrackFromPeers(track) {
        this.peers.forEach((p) => {
            const sender = p.getSenders().find((sender) => {
                return sender.track.id === track.id;
            });
            if (sender)
                p.peerConnection.removeTrack(sender);
        });
    }
    getRtpSenders(peerId) {
        if (!this.peers.has(peerId))
            throw "Cannot find the peer";
        return this.peers.get(peerId).getSenders();
    }
    getRtpReceivers(peerId) {
        if (!this.peers.has(peerId))
            throw "Cannot find the peer";
        return this.peers.get(peerId).getReceivers();
    }
    setMediaBitrate(sdp, media, bitrate) {
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
    createDataChannel(name) {
        const channel = new DataChannel_1.DataChannel(name);
        this.dataChannels.set(name, channel);
        return channel;
    }
    removeDataChannel(name) {
        this.dataChannels.delete(name);
    }
    addError(err) {
        if (this.onError)
            this.onError(err);
    }
    onCandidate(event) {
        const msg = JSON.parse(event.message);
        let candidate = msg.iceCandidate;
        let pc = this.getOrCreateRTCPeerConnection(event.sender);
        pc.addIceCandidate(new RTCIceCandidate(candidate)).then(() => {
        }).catch((err) => {
            this.addError(err);
        });
    }
    onAnswer(event) {
        let pc = this.getOrCreateRTCPeerConnection(event.sender);
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message))).then((p) => {
        }).catch((err) => {
            this.addError(err);
        });
    }
    onOffer(event, skipLocalTracks) {
        let pc = this.getOrCreateRTCPeerConnection(event.sender);
        if (!skipLocalTracks) {
            this.localStreams.forEach((stream) => {
                stream.getTracks().forEach((track) => {
                    let rtpSender = pc.addTrack(track, stream);
                    if (this.isEncrypted) {
                        let streams = rtpSender.createEncodedStreams();
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
        const rtcAnswer = { offerToReceiveAudio: true, offerToReceiveVideo: true };
        pc.createAnswer(rtcAnswer).then((description) => {
            pc.setLocalDescription(description).then(() => {
                const answer = {
                    sender: this.localPeerId,
                    recipient: event.sender,
                    message: JSON.stringify(description)
                };
                this.signalingController.invoke("contextSignal", answer);
            }).catch((err) => this.addError(err));
        }).catch((err) => this.addError(err));
    }
    applyVideoConstraints(mtc) {
        let work = Array.from(this.peers.values()).map(v => {
            return v.getSenders().map(sender => {
                return sender.track.applyConstraints(mtc);
            });
        });
        return Promise.all(work);
    }
    applyBandwithConstraints(bandwidth) {
        this.peers.forEach((p) => {
            p.getSenders().find((sender) => {
                const parameters = sender.getParameters();
                if (!parameters.encodings) {
                    parameters.encodings = [{}];
                }
                if (parameters.encodings[0]) {
                    parameters.encodings[0].maxBitrate = bandwidth * 1000;
                    sender.setParameters(parameters).then(() => {
                        console.log("apply bandwith constraints successfully applied.");
                    }).catch(e => {
                        this.onError(e);
                    });
                }
            });
        });
    }
    addLocalStream(stream) {
        this.localStreams.push(stream);
        return this;
    }
    addIceServer(iceServer) {
        this.rtcConfig.iceServers.push(iceServer);
        return this;
    }
    removePeerConnection(id) {
        this.peers.delete(id);
    }
    createRTCPeerConnection(id) {
        let config;
        if (this.isEncrypted) {
            config = this.rtcConfig;
            config.encodedInsertableStreams = true;
            config.forceEncodedVideoInsertableStreams = true;
            config.forceEncodedAudioInsertableStreams = true;
        }
        else {
            config = this.rtcConfig;
        }
        let rtcPeerConnection = new RTCPeerConnection(config);
        rtcPeerConnection.onsignalingstatechange = (state) => { };
        rtcPeerConnection.onicecandidate = (event) => {
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
        rtcPeerConnection.oniceconnectionstatechange = (event) => {
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
        rtcPeerConnection.ontrack = (event) => {
            const track = event.track;
            const kind = event.track.kind;
            const connection = this.peers.get(id);
            event.track.onended = (e) => {
                if (this.onRemoteTrackLost)
                    this.onRemoteTrackLost(track, connection, e);
            };
            if (kind === "video" && this.onRemoteVideoTrack) {
                this.onRemoteVideoTrack(track, connection, event);
            }
            else if (kind === "audio" && this.onRemoteAudioTrack) {
                this.onRemoteAudioTrack(track, connection, event);
            }
            if (this.onRemoteTrack)
                this.onRemoteTrack(track, connection, event);
        };
        this.dataChannels.forEach((dataChannel) => {
            let pc = new PeerChannel_1.PeerChannel(id, rtcPeerConnection.createDataChannel(dataChannel.label), dataChannel.label);
            dataChannel.addPeerChannel(pc);
            rtcPeerConnection.ondatachannel = (event) => {
                let channel = event.channel;
                channel.onopen = (event) => {
                    this.dataChannels.get(channel.label).onOpen(event, id, channel.label);
                };
                channel.onclose = (event) => {
                    this.dataChannels.get(channel.label).removePeerChannel(id);
                    this.dataChannels.get(channel.label).onClose(event, id, channel.label);
                };
                channel.onmessage = (message) => {
                    this.dataChannels.get(channel.label).onMessage(message);
                };
            };
        });
        return rtcPeerConnection;
    }
    cleanUp(id) {
        this.dataChannels.forEach((d) => {
            d.removePeerChannel(id);
        });
    }
    findPeerConnection(id) {
        return this.peers.get(id);
    }
    reconnectAll() {
        throw "not yet implemeted";
    }
    getOrCreateRTCPeerConnection(id) {
        let match = this.peers.get(id);
        if (!match) {
            let pc = new ThorIOConnection_1.ThorIOConnection(id, this.createRTCPeerConnection(id));
            this.peers.set(id, pc);
            return pc.peerConnection;
        }
        return match.peerConnection;
    }
    createOffer(peer) {
        let peerConnection = this.createRTCPeerConnection(peer.peerId);
        this.localStreams.forEach((stream) => {
            stream.getTracks().forEach((track) => {
                const rtpSender = peerConnection.addTrack(track, stream);
                if (this.isEncrypted) {
                    let senderStreams = rtpSender.createEncodedStreams();
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
        peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then((description) => {
            peerConnection.setLocalDescription(description).then(() => {
                let offer = {
                    sender: this.localPeerId,
                    recipient: peer.peerId,
                    message: JSON.stringify(description)
                };
                this.signalingController.invoke("contextSignal", offer);
            }).catch((err) => {
                this.addError(err);
            });
        }).catch((err) => {
            this.addError(err);
        });
        return peerConnection;
    }
    disconnect() {
        this.peers.forEach((connection) => {
            connection.peerConnection.close();
        });
        this.changeContext(Math.random().toString(36).substring(2));
    }
    disconnectPeer(id) {
        let peer = this.findPeerConnection(id);
        if (peer)
            peer.peerConnection.close();
    }
    connect(peerConnections) {
        peerConnections.forEach((peerConnection) => {
            this.connectTo(peerConnection);
        });
    }
    connectTo(peerConnection) {
        let pc = new ThorIOConnection_1.ThorIOConnection(peerConnection.peerId, this.createOffer(peerConnection));
        if (!this.peers.has(peerConnection.peerId))
            this.peers.set(peerConnection.peerId, pc);
    }
    changeContext(context) {
        this.signalingController.invoke("changeContext", { context: context });
        return this;
    }
    connectPeers() {
        this.signalingController.invoke("connectContext", {});
    }
    connectContext() {
        this.connectPeers();
    }
}
exports.WebRTCFactory = WebRTCFactory;
