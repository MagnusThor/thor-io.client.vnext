"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebRTCConnection_1 = require("./WebRTCConnection");
var PeerChannel_1 = require("./PeerChannel");
var DataChannel_1 = require("./DataChannel");
var BandwidthConstraints_1 = require("./BandwidthConstraints");
var WebRTC = (function () {
    function WebRTC(brokerController, rtcConfig) {
        var _this = this;
        this.brokerController = brokerController;
        this.rtcConfig = rtcConfig;
        this.Errors = new Array();
        this.LocalStreams = new Array();
        this.DataChannels = new Map();
        this.Peers = new Map();
        this.brokerController.On("contextSignal", function (signal) {
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
        brokerController.On("contextCreated", function (peer) {
            _this.LocalPeerId = peer.peerId;
            _this.Context = peer.context;
            _this.OnContextCreated(peer);
        });
        brokerController.On("contextChanged", function (context) {
            _this.Context = context;
            _this.OnContextChanged(context);
        });
        brokerController.On("connectTo", function (peers) {
            _this.onConnectTo(peers);
        });
    }
    WebRTC.prototype.onConnectTo = function (peerConnections) {
        this.Connect(peerConnections);
    };
    WebRTC.prototype.onConnected = function (peerId) {
        if (this.OnContextConnected)
            this.OnContextConnected(this.findPeerConnection(peerId), this.getPeerConnection(peerId));
    };
    WebRTC.prototype.OnDisconnected = function (peerId) {
        var peerConnection = this.getPeerConnection(peerId);
        if (this.OnContextDisconnected)
            this.OnContextDisconnected(this.findPeerConnection(peerId), peerConnection);
        peerConnection.close();
        this.removePeerConnection(peerId);
    };
    WebRTC.prototype.addTrackToPeers = function (track) {
        var _this = this;
        Array.from((this.Peers.values())).forEach(function (p) {
            var pc = p.RTCPeer;
            pc.onnegotiationneeded = function (e) {
                pc.createOffer()
                    .then(function (offer) { return pc.setLocalDescription(offer); })
                    .then(function () {
                    var offer = {
                        sender: _this.LocalPeerId,
                        recipient: p.id,
                        message: JSON.stringify(pc.localDescription),
                        skipLocalTracks: true
                    };
                    _this.brokerController.Invoke("contextSignal", offer);
                });
            };
            p.RTCPeer.addTrack(track);
        });
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
    WebRTC.prototype.CreateDataChannel = function (name) {
        var channel = new DataChannel_1.DataChannel(name);
        this.DataChannels.set(name, channel);
        return channel;
    };
    WebRTC.prototype.RemoveDataChannel = function (name) {
        this.DataChannels.delete(name);
    };
    WebRTC.prototype.addError = function (err) {
        this.OnError(err);
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
            this.LocalStreams.forEach(function (stream) {
                stream.getTracks().forEach(function (track) {
                    pc.addTrack(track, stream);
                });
            });
        }
        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message)));
        pc.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then(function (description) {
            pc.setLocalDescription(description).then(function () {
                if (_this.bandwidthConstraints)
                    description.sdp = _this.setMediaBitrates(description.sdp);
                var answer = {
                    sender: _this.LocalPeerId,
                    recipient: event.sender,
                    message: JSON.stringify(description)
                };
                _this.brokerController.Invoke("contextSignal", answer);
            }).catch(function (err) { return _this.addError(err); });
        }).catch(function (err) { return _this.addError(err); });
    };
    WebRTC.prototype.AddLocalStream = function (stream) {
        this.LocalStreams.push(stream);
        return this;
    };
    WebRTC.prototype.AddIceServer = function (iceServer) {
        this.rtcConfig.iceServers.push(iceServer);
        return this;
    };
    WebRTC.prototype.removePeerConnection = function (id) {
        this.Peers.delete(id);
    };
    WebRTC.prototype.createPeerConnection = function (id) {
        var _this = this;
        var rtcPeerConnection = new RTCPeerConnection(this.rtcConfig);
        rtcPeerConnection.onsignalingstatechange = function (state) { };
        rtcPeerConnection.onicecandidate = function (event) {
            if (!event || !event.candidate)
                return;
            if (event.candidate) {
                var msg = {
                    sender: _this.LocalPeerId,
                    recipient: id,
                    message: JSON.stringify({
                        type: 'candidate',
                        iceCandidate: event.candidate
                    })
                };
                _this.brokerController.Invoke("contextSignal", msg);
            }
        };
        rtcPeerConnection.oniceconnectionstatechange = function (event) {
            switch (event.target.iceConnectionState) {
                case "connected":
                    _this.onConnected(id);
                    break;
                case "disconnected":
                    _this.cleanUp(id);
                    _this.OnDisconnected(id);
                    break;
            }
        };
        rtcPeerConnection.ontrack = function (event) {
            var connection = _this.Peers.get(id);
            connection.stream.addTrack(event.track);
            if (_this.OnRemoteTrack)
                _this.OnRemoteTrack(event.track, connection);
        };
        this.DataChannels.forEach(function (dataChannel) {
            var pc = new PeerChannel_1.PeerChannel(id, rtcPeerConnection.createDataChannel(dataChannel.label), dataChannel.label);
            dataChannel.addPeerChannel(pc);
            rtcPeerConnection.ondatachannel = function (event) {
                var channel = event.channel;
                channel.onopen = function (event) {
                    _this.DataChannels.get(channel.label).OnOpen(event, id, channel.label);
                };
                channel.onclose = function (event) {
                    _this.DataChannels.get(channel.label).removePeerChannel(id);
                    _this.DataChannels.get(channel.label).OnClose(event, id, channel.label);
                };
                channel.onmessage = function (message) {
                    _this.DataChannels.get(channel.label).onMessage(message);
                };
            };
        });
        return rtcPeerConnection;
    };
    WebRTC.prototype.cleanUp = function (id) {
        this.DataChannels.forEach(function (d) {
            d.removePeerChannel(id);
        });
    };
    WebRTC.prototype.findPeerConnection = function (id) {
        return this.Peers.get(id);
    };
    WebRTC.prototype.reconnectAll = function () {
        throw "not yet implemeted";
    };
    WebRTC.prototype.getPeerConnection = function (id) {
        var match = this.Peers.get(id);
        if (!match) {
            var pc = new WebRTCConnection_1.WebRTCConnection(id, this.createPeerConnection(id));
            this.Peers.set(id, pc);
            return pc.RTCPeer;
        }
        return match.RTCPeer;
    };
    WebRTC.prototype.createOffer = function (peer) {
        var _this = this;
        var peerConnection = this.createPeerConnection(peer.peerId);
        this.LocalStreams.forEach(function (stream) {
            stream.getTracks().forEach(function (track) {
                peerConnection.addTrack(track, stream);
            });
            _this.OnLocalStream(stream);
        });
        peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then(function (description) {
            peerConnection.setLocalDescription(description).then(function () {
                if (_this.bandwidthConstraints)
                    description.sdp = _this.setMediaBitrates(description.sdp);
                var offer = {
                    sender: _this.LocalPeerId,
                    recipient: peer.peerId,
                    message: JSON.stringify(description)
                };
                _this.brokerController.Invoke("contextSignal", offer);
            }).catch(function (err) {
                _this.addError(err);
            });
        }).catch(function (err) {
            _this.addError(err);
        });
        return peerConnection;
    };
    WebRTC.prototype.Disconnect = function () {
        this.Peers.forEach(function (connection) {
            connection.RTCPeer.close();
        });
        this.ChangeContext(Math.random().toString(36).substring(2));
    };
    WebRTC.prototype.DisconnectPeer = function (id) {
        var peer = this.findPeerConnection(id);
        peer.RTCPeer.close();
    };
    WebRTC.prototype.Connect = function (peerConnections) {
        var _this = this;
        peerConnections.forEach(function (peerConnection) {
            var pc = new WebRTCConnection_1.WebRTCConnection(peerConnection.peerId, _this.createOffer(peerConnection));
            _this.Peers.set(peerConnection.peerId, pc);
        });
        return this;
    };
    WebRTC.prototype.ChangeContext = function (context) {
        this.brokerController.Invoke("changeContext", { context: context });
        return this;
    };
    WebRTC.prototype.ConnectPeers = function () {
        this.brokerController.Invoke("connectContext", {});
    };
    WebRTC.prototype.ConnectContext = function () {
        this.ConnectPeers();
    };
    return WebRTC;
}());
exports.WebRTC = WebRTC;
