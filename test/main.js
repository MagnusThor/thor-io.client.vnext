"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var EncodeDecode_1 = require("../src/E2EE/EncodeDecode");
var Main = (function () {
    function Main() {
        var randomCryptoKey = __1.Utils.newRandomString(5);
        var factory = new __1.Factory("wss://dev-wss.kollokvium.net/", ["broker"]);
        factory.onOpen = function (signaling) {
            signaling.onOpen = function () {
                document.querySelector("input#e2ee-key").value = randomCryptoKey;
                document.querySelector("button#set-key").addEventListener("click", function () {
                    rtc.e2ee.setKey(document.querySelector("input").value);
                });
                var e2ee = new EncodeDecode_1.E2EEBase(randomCryptoKey);
                var rtc = new __1.WebRTC(signaling, {
                    "sdpSemantics": "plan-b",
                    "iceTransports": "all",
                    "rtcpMuxPolicy": "require",
                    "bundlePolicy": "max-bundle",
                    "iceServers": [
                        {
                            "urls": "stun:stun.l.google.com:19302"
                        }
                    ]
                }, e2ee);
                rtc.onContextConnected = function (connection, rtcPeerConnection) {
                    console.log("Connected to ", connection.id);
                };
                rtc.onContextCreated = function (peer) {
                };
                rtc.onContextChanged = function (data) {
                    console.log("Now connected to " + data.context);
                    document.querySelector("h1#context-name").textContent = data.context;
                    rtc.connectContext();
                };
                rtc.onRemoteTrack = function (track, connection, event) {
                    console.log("Got a remote stream", connection, track, event);
                    var streams = event.receiver.createEncodedStreams();
                    streams.readableStream
                        .pipeThrough(new TransformStream({
                        transform: rtc.e2ee.decode.bind(rtc.e2ee),
                    }))
                        .pipeTo(streams.writableStream);
                    document.querySelector("video#remote").srcObject = event.streams[0];
                };
                navigator.mediaDevices.getUserMedia({
                    audio: true, video: {
                        width: {
                            ideal: 640
                        }, height: { ideal: 360 }
                    }
                }).then(function (ms) {
                    rtc.addLocalStream(ms);
                    document.querySelector("video#local").srcObject = ms;
                    rtc.changeContext(location.hash.length === 0 ? "foo" : location.hash);
                });
            };
            signaling.connect();
        };
    }
    return Main;
}());
exports.Main = Main;
document.addEventListener("DOMContentLoaded", function () {
    console.log("Starting");
    var test = new Main();
});
