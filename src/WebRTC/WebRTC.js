"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PeerConnection_1 = require("./PeerConnection");
var WebRTCConnection_1 = require("./WebRTCConnection");
var PeerChannel_1 = require("./PeerChannel");
var DataChannel_1 = require("./DataChannel");
var BandwidthConstraints_1 = require("./BandwidthConstraints");
var WebRTC = /** @class */ (function () {
    function WebRTC(brokerProxy, rtcConfig) {
        var _this = this;
        this.brokerProxy = brokerProxy;
        this.rtcConfig = rtcConfig;
        this.getPeerIndex = function (id) {
            return this.Peers.findIndex(function (pre) { return pre.id === id; });
        };
        this.Errors = new Array();
        this.DataChannels = new Array();
        this.Peers = new Array();
        this.LocalStreams = new Array();
        this.signalHandlers();
        brokerProxy.On("contextCreated", function (peer) {
            _this.LocalPeerId = peer.peerId;
            _this.Context = peer.context;
            _this.OnContextCreated(peer);
        });
        brokerProxy.On("contextChanged", function (context) {
            _this.Context = context;
            _this.OnContextChanged(context);
        });
        brokerProxy.On("connectTo", function (peers) {
            _this.OnConnectTo(peers);
        });
    }
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
        this.DataChannels.push(channel);
        return channel;
    };
    WebRTC.prototype.RemoveDataChannel = function (name) {
        var match = this.DataChannels.find(function (p) { return p.Name === name; });
        this.DataChannels.splice(this.DataChannels.indexOf(match), 1);
    };
    WebRTC.prototype.signalHandlers = function () {
        var _this = this;
        this.brokerProxy.On("contextSignal", function (signal) {
            var msg = JSON.parse(signal.message);
            switch (msg.type) {
                case "offer":
                    _this.onOffer(signal);
                    break;
                case "answer":
                    _this.onAnswer(signal);
                    break;
                case "candidate":
                    _this.onCandidate(signal);
                    break;
                default:
                    // do op
                    break;
            }
        });
    };
    WebRTC.prototype.addError = function (err) {
        this.OnError(err);
    };
    WebRTC.prototype.OnConnectTo = function (peerConnections) {
        this.Connect(peerConnections);
    };
    WebRTC.prototype.OnConnected = function (peerId) {
        this.OnContextConnected(this.findPeerConnection(peerId), this.getPeerConnection(peerId));
    };
    WebRTC.prototype.OnDisconnected = function (peerId) {
        var peerConnection = this.getPeerConnection(peerId);
        this.OnContextDisconnected(this.findPeerConnection(peerId), peerConnection);
        peerConnection.close();
        this.removePeerConnection(peerId);
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
    WebRTC.prototype.onOffer = function (event) {
        var _this = this;
        var pc = this.getPeerConnection(event.sender);
        this.LocalStreams.forEach(function (stream) {
            stream.getTracks().forEach(function (track) {
                pc.addTrack(track, stream);
            });
        });
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
                _this.brokerProxy.Invoke("contextSignal", answer);
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
        var connection = this.Peers.find(function (conn) {
            return conn.id === id;
        });
        var index = this.Peers.indexOf(connection);
        if (index > -1)
            this.Peers.splice(index, 1);
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
                _this.brokerProxy.Invoke("contextSignal", msg);
            }
        };
        rtcPeerConnection.oniceconnectionstatechange = function (event) {
            switch (event.target.iceConnectionState) {
                case "connected":
                    _this.OnConnected(id);
                    break;
                case "disconnected":
                    _this.OnDisconnected(id);
                    break;
            }
            ;
        };
        rtcPeerConnection.ontrack = function (event) {
            var connection = _this.Peers.find(function (p) {
                return p.id === id;
            });
            connection.stream.addTrack(event.track);
            _this.OnRemoteTrack(event.track, connection);
        };
        this.DataChannels.forEach(function (dataChannel) {
            var pc = new PeerChannel_1.PeerChannel(id, rtcPeerConnection.createDataChannel(dataChannel.Name), dataChannel.Name);
            dataChannel.AddPeerChannel(pc);
            rtcPeerConnection.ondatachannel = function (event) {
                var channel = event.channel;
                channel.onopen = function (event) {
                    dataChannel.OnOpen(event, id);
                };
                channel.onclose = function (event) {
                    dataChannel.RemovePeerChannel(id);
                    dataChannel.OnClose(event, id);
                };
                channel.onmessage = function (message) {
                    dataChannel.OnMessage(message);
                };
            };
        });
        return rtcPeerConnection;
    };
    WebRTC.prototype.findPeerConnection = function (id) {
        var i = this.getPeerIndex(id);
        return this.Peers[i];
    };
    WebRTC.prototype.reconnectAll = function () {
        var _this = this;
        var peers = this.Peers.map(function (peer) {
            var p = new PeerConnection_1.PeerConnection();
            p.peerId = peer.id;
            p.context = _this.Context;
            return p;
        });
        this.Peers = new Array();
        this.Connect(peers);
        return peers;
    };
    WebRTC.prototype.getPeerConnection = function (id) {
        var match = this.Peers.find(function (connection) {
            return connection.id === id;
        });
        if (!match) {
            var pc = new WebRTCConnection_1.WebRTCConnection(id, this.createPeerConnection(id));
            this.Peers.push(pc);
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
                _this.brokerProxy.Invoke("contextSignal", offer);
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
            _this.Peers.push(pc);
        });
        return this;
    };
    WebRTC.prototype.ChangeContext = function (context) {
        this.brokerProxy.Invoke("changeContext", { context: context });
        return this;
    };
    WebRTC.prototype.ConnectPeers = function () {
        this.brokerProxy.Invoke("connectContext", {});
    };
    WebRTC.prototype.ConnectContext = function () {
        this.ConnectPeers();
    };
    return WebRTC;
}());
exports.WebRTC = WebRTC;
//# sourceMappingURL=WebRTC.js.map