"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class Main {
    constructor() {
        let useE2EE = location.search.includes("e2ee");
        let randomCryptoKey = __1.Utils.newRandomString(5);
        let factory = new __1.Factory("wss://dev-wss.kollokvium.net/", ["broker"]);
        factory.onOpen = (signaling) => {
            signaling.onOpen = () => {
                let e2ee = new __1.E2EEBase(randomCryptoKey);
                let rtc = new __1.WebRTC(signaling, {
                    "sdpSemantics": "unified-plan",
                    "iceTransports": "all",
                    "rtcpMuxPolicy": "require",
                    "bundlePolicy": "max-bundle",
                    "iceServers": [
                        {
                            "urls": "stun:stun.l.google.com:19302"
                        }
                    ]
                }, useE2EE ? e2ee : undefined);
                console.log("using es22");
                if (useE2EE) {
                    document.querySelector("input#e2ee-key").value = randomCryptoKey;
                    document.querySelector("#set-key").addEventListener("click", (e) => {
                        rtc.e2ee.setKey(document.querySelector("input#e2ee-key").value);
                    });
                }
                rtc.onContextDisconnected = (w, r) => {
                    console.log("lost a peer", w, r);
                };
                rtc.onContextConnected = (connection, rtcPeerConnection) => {
                    console.log("Connected to ", connection.id);
                };
                rtc.onContextCreated = (peer) => {
                };
                rtc.onContextChanged = (data) => {
                    console.log(`Now connected to ${data.context}`);
                    document.querySelector("h1#context-name").textContent = data.context;
                    rtc.connectContext();
                };
                rtc.onRemoteTrackLost = (track, connection, event) => {
                    try {
                        document.querySelector(`video.t${track.id}`).remove();
                    }
                    catch (err) {
                        console.log(`Failed to remove a track ${track.id}`);
                    }
                };
                rtc.onRemoteVideoTrack = (track, connection, event) => {
                    console.log(`Addaed a video for connection ${connection.id}`);
                    let video = document.createElement("video");
                    video.muted = true;
                    video.classList.add(`t${track.id}`);
                    video.autoplay = true;
                    let stream;
                    if (useE2EE) {
                        let streams = event.receiver.createEncodedStreams();
                        streams.readableStream
                            .pipeThrough(new TransformStream({
                            transform: rtc.e2ee.decode.bind(rtc.e2ee),
                        }))
                            .pipeTo(streams.writableStream);
                    }
                    if (event.streams[0]) {
                        stream = event.streams[0];
                    }
                    else
                        stream = new MediaStream([track]);
                    video.srcObject = stream;
                    document.querySelector("#remote").prepend(video);
                };
                document.querySelector("button#add-track").addEventListener("click", () => {
                    const gdmOptions = {
                        video: {
                            cursor: "always"
                        },
                        audio: false
                    };
                    navigator.mediaDevices["getDisplayMedia"](gdmOptions).then((e) => {
                        rtc.addTrackToPeers(e.getVideoTracks()[0]);
                    });
                });
                navigator.mediaDevices.getUserMedia({
                    audio: true, video: {
                        width: {
                            ideal: 640
                        }, height: { ideal: 360 }
                    }
                }).then((ms) => {
                    rtc.addLocalStream(ms);
                    document.querySelector("video#local").srcObject = ms;
                    rtc.changeContext(location.hash.length === 0 ? "foo" : location.hash);
                });
            };
            signaling.connect();
        };
    }
}
exports.Main = Main;
document.addEventListener("DOMContentLoaded", () => {
    500;
    console.log("Starting");
    let test = new Main();
});
