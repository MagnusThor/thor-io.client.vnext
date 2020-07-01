"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebRTCConnection_1 = require("./WebRTCConnection");
var PeerChannel_1 = require("./PeerChannel");
var DataChannel_1 = require("./DataChannel");
var BandwidthConstraints_1 = require("./BandwidthConstraints");
var WebRTC = (function () {
    function WebRTC(brokerController, rtcConfig, e2ee) {
        var _this = this;
        this.brokerController = brokerController;
        this.rtcConfig = rtcConfig;
        if (e2ee) {
            this.isEncrypted = true;
            this.e2ee = e2ee;
        }
        else {
            this.isEncrypted = false;
        }
        this.errors = new Array();
        this.localStreams = new Array();
        this.dataChannels = new Map();
        this.peers = new Map();
        this.brokerController.on("contextSignal", function (signal) {
            var msg = JSON.parse(signal.message);
            switch (msg.type) {
                case "offer":
                    _this.onOffer(signal, signal.skipLocalTracks || false);
                    break;
                case "answer":
                    _this.onAnswer(signal);
                    break;
                case "candidate":
                    _this.onCandidate(signal);
                    break;
            }
        });
        brokerController.on("contextCreated", function (peer) {
            _this.localPeerId = peer.peerId;
            _this.context = peer.context;
            _this.onContextCreated(peer);
        });
        brokerController.on("contextChanged", function (context) {
            _this.context = context;
            _this.onContextChanged(context);
        });
        brokerController.on("connectTo", function (peers) {
            _this.onConnectTo(peers);
        });
    }
    WebRTC.prototype.onConnectTo = function (peerConnections) {
        this.connect(peerConnections);
    };
    WebRTC.prototype.onConnected = function (peerId) {
        if (this.onContextConnected)
            this.onContextConnected(this.findPeerConnection(peerId), this.getPeerConnection(peerId));
    };
    WebRTC.prototype.onDisconnected = function (peerId) {
        var peerConnection = this.getPeerConnection(peerId);
        if (this.onContextDisconnected)
            this.onContextDisconnected(this.findPeerConnection(peerId), peerConnection);
        peerConnection.close();
        this.removePeerConnection(peerId);
    };
    WebRTC.prototype.addTrackToPeers = function (track) {
        var _this = this;
        this.peers.forEach(function (p) {
            var pc = p.RTCPeer;
            pc.onnegotiationneeded = function (e) {
                pc.createOffer()
                    .then(function (offer) { return pc.setLocalDescription(offer); })
                    .then(function () {
                    var offer = {
                        sender: _this.localPeerId,
                        recipient: p.id,
                        message: JSON.stringify(pc.localDescription),
                        skipLocalTracks: true
                    };
                    _this.brokerController.invoke("contextSignal", offer);
                });
            };
            p.RTCPeer.addTrack(track);
        });
    };
    WebRTC.prototype.removeTrackFromPeers = function (track) {
        this.peers.forEach(function (p) {
            var sender = p.RTCPeer.getSenders().find(function (sender) {
                return sender.track.id === track.id;
            });
            p.RTCPeer.removeTrack(sender);
        });
    };
    WebRTC.prototype.getRtpSenders = function (peerId) {
        if (!this.peers.has(peerId))
            throw "Cannot find the peer";
        return this.peers.get(peerId).RTCPeer.getSenders();
    };
    WebRTC.prototype.getRtpReceivers = function (peerId) {
        if (!this.peers.has(peerId))
            throw "Cannot find the peer";
        return this.peers.get(peerId).RTCPeer.getReceivers();
    };
    WebRTC.prototype.setBandwithConstraints = function (videobandwidth, audiobandwidth) {
        this.bandwidthConstraints = new BandwidthConstraints_1.BandwidthConstraints(videobandwidth, audiobandwidth);
    };
    WebRTC.prototype.setMediaBitrates = function (sdp) {
        return this.setMediaBitrate(this.setMediaBitrate(sdp, "video", this.bandwidthConstraints.videobandwidth), "audio", this.bandwidthConstraints.audiobandwidth);
    };
    WebRTC.prototype.setMediaBitrate = function (sdp, media, bitrate) {
        var lines = sdp.split("\n");
        var line = -1;
        for (var i = 0; i < lines.length; i++) {
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
    };
    WebRTC.prototype.createDataChannel = function (name) {
        var channel = new DataChannel_1.DataChannel(name);
        this.dataChannels.set(name, channel);
        return channel;
    };
    WebRTC.prototype.removeDataChannel = function (name) {
        this.dataChannels.delete(name);
    };
    WebRTC.prototype.addError = function (err) {
        this.onError(err);
    };
    WebRTC.prototype.onCandidate = function (event) {
        var _this = this;
        var msg = JSON.parse(event.message);
        var candidate = msg.iceCandidate;
        var pc = this.getPeerConnection(event.sender);
        pc.addIceCandidate(new RTCIceCandidate(candidate)).then(function () {
        }).catch(function (err) {
            _this.addError(err);
        });
    };
    WebRTC.prototype.onAnswer = function (event) {
        var _this = this;
        var pc = this.getPeerConnection(event.sender);
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message))).then(function (p) {
        }).catch(function (err) {
            _this.addError(err);
        });
    };
    WebRTC.prototype.onOffer = function (event, skipLocalTracks) {
        var _this = this;
        var pc = this.getPeerConnection(event.sender);
        if (!skipLocalTracks) {
            this.localStreams.forEach(function (stream) {
                stream.getTracks().forEach(function (track) {
                    var rtpSender = pc.addTrack(track, stream);
                    if (_this.isEncrypted) {
                        var streams = rtpSender.createEncodedStreams();
                        streams.readableStream
                            .pipeThrough(new TransformStream({
                            transform: _this.e2ee.encode.bind(_this.e2ee),
                        }))
                            .pipeTo(streams.writableStream);
                    }
                });
            });
        }
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message)));
        pc.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then(function (description) {
            pc.setLocalDescription(description).then(function () {
                if (_this.bandwidthConstraints)
                    description.sdp = _this.setMediaBitrates(description.sdp);
                var answer = {
                    sender: _this.localPeerId,
                    recipient: event.sender,
                    message: JSON.stringify(description)
                };
                _this.brokerController.invoke("contextSignal", answer);
            }).catch(function (err) { return _this.addError(err); });
        }).catch(function (err) { return _this.addError(err); });
    };
    WebRTC.prototype.addLocalStream = function (stream) {
        this.localStreams.push(stream);
        return this;
    };
    WebRTC.prototype.addIceServer = function (iceServer) {
        this.rtcConfig.iceServers.push(iceServer);
        return this;
    };
    WebRTC.prototype.removePeerConnection = function (id) {
        this.peers.delete(id);
    };
    WebRTC.prototype.createPeerConnection = function (id) {
        var _this = this;
        var config;
        if (this.isEncrypted) {
            config = this.rtcConfig;
            config.encodedInsertableStreams = true;
            config.forceEncodedVideoInsertableStreams = true;
            config.forceEncodedAudioInsertableStreams = true;
        }
        else {
            config = this.rtcConfig;
        }
        var rtcPeerConnection = new RTCPeerConnection(config);
        rtcPeerConnection.onsignalingstatechange = function (state) { };
        rtcPeerConnection.onicecandidate = function (event) {
            if (!event || !event.candidate)
                return;
            if (event.candidate) {
                var msg = {
                    sender: _this.localPeerId,
                    recipient: id,
                    message: JSON.stringify({
                        type: 'candidate',
                        iceCandidate: event.candidate
                    })
                };
                _this.brokerController.invoke("contextSignal", msg);
            }
        };
        rtcPeerConnection.oniceconnectionstatechange = function (event) {
            switch (event.target.iceConnectionState) {
                case "connected":
                    _this.onConnected(id);
                    break;
                case "disconnected":
                    _this.cleanUp(id);
                    _this.onDisconnected(id);
                    break;
            }
        };
        rtcPeerConnection.ontrack = function (event) {
            var connection = _this.peers.get(id);
            connection.Stream.addTrack(event.track);
            if (_this.onRemoteTrack)
                _this.onRemoteTrack(event.track, connection, event);
        };
        this.dataChannels.forEach(function (dataChannel) {
            var pc = new PeerChannel_1.PeerChannel(id, rtcPeerConnection.createDataChannel(dataChannel.label), dataChannel.label);
            dataChannel.addPeerChannel(pc);
            rtcPeerConnection.ondatachannel = function (event) {
                var channel = event.channel;
                channel.onopen = function (event) {
                    _this.dataChannels.get(channel.label).onOpen(event, id, channel.label);
                };
                channel.onclose = function (event) {
                    _this.dataChannels.get(channel.label).removePeerChannel(id);
                    _this.dataChannels.get(channel.label).onClose(event, id, channel.label);
                };
                channel.onmessage = function (message) {
                    _this.dataChannels.get(channel.label).onMessage(message);
                };
            };
        });
        return rtcPeerConnection;
    };
    WebRTC.prototype.cleanUp = function (id) {
        this.dataChannels.forEach(function (d) {
            d.removePeerChannel(id);
        });
    };
    WebRTC.prototype.findPeerConnection = function (id) {
        return this.peers.get(id);
    };
    WebRTC.prototype.reconnectAll = function () {
        throw "not yet implemeted";
    };
    WebRTC.prototype.getPeerConnection = function (id) {
        var match = this.peers.get(id);
        if (!match) {
            var pc = new WebRTCConnection_1.WebRTCConnection(id, this.createPeerConnection(id));
            this.peers.set(id, pc);
            return pc.RTCPeer;
        }
        return match.RTCPeer;
    };
    WebRTC.prototype.createOffer = function (peer) {
        var _this = this;
        var peerConnection = this.createPeerConnection(peer.peerId);
        this.localStreams.forEach(function (stream) {
            stream.getTracks().forEach(function (track) {
                var rtpSender = peerConnection.addTrack(track, stream);
                if (_this.isEncrypted) {
                    var senderStreams = rtpSender.createEncodedStreams();
                    senderStreams.readableStream
                        .pipeThrough(new TransformStream({
                        transform: _this.e2ee.encode.bind(_this.e2ee),
                    }))
                        .pipeTo(senderStreams.writableStream);
                }
            });
            if (_this.onLocalStream)
                _this.onLocalStream(stream);
        });
        peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then(function (description) {
            peerConnection.setLocalDescription(description).then(function () {
                if (_this.bandwidthConstraints)
                    description.sdp = _this.setMediaBitrates(description.sdp);
                var offer = {
                    sender: _this.localPeerId,
                    recipient: peer.peerId,
                    message: JSON.stringify(description)
                };
                _this.brokerController.invoke("contextSignal", offer);
            }).catch(function (err) {
                _this.addError(err);
            });
        }).catch(function (err) {
            _this.addError(err);
        });
        return peerConnection;
    };
    WebRTC.prototype.disconnect = function () {
        this.peers.forEach(function (connection) {
            connection.RTCPeer.close();
        });
        this.changeContext(Math.random().toString(36).substring(2));
    };
    WebRTC.prototype.disconnectPeer = function (id) {
        var peer = this.findPeerConnection(id);
        peer.RTCPeer.close();
    };
    WebRTC.prototype.connect = function (peerConnections) {
        var _this = this;
        peerConnections.forEach(function (peerConnection) {
            var pc = new WebRTCConnection_1.WebRTCConnection(peerConnection.peerId, _this.createOffer(peerConnection));
            _this.peers.set(peerConnection.peerId, pc);
        });
        return this;
    };
    WebRTC.prototype.changeContext = function (context) {
        this.brokerController.invoke("changeContext", { context: context });
        return this;
    };
    WebRTC.prototype.connectPeers = function () {
        this.brokerController.invoke("connectContext", {});
    };
    WebRTC.prototype.connectContext = function () {
        this.connectPeers();
    };
    return WebRTC;
}());
exports.WebRTC = WebRTC;
