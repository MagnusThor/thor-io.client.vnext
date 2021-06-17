"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Main = void 0;
const __1 = require("..");
class Main {
    constructor() {
        let factory = new __1.ClientFactory("wss://dev-wss.kollokvium.net/", ["broker"]);
        factory.onOpen = (signaling) => {
            signaling.onOpen = () => {
                let rtc = new __1.WebRTCFactory(signaling, {
                    "sdpSemantics": "unified-plan",
                    "iceTransports": "all",
                    "rtcpMuxPolicy": "require",
                    "bundlePolicy": "max-bundle",
                    "iceServers": [
                        {
                            "urls": "stun:stun.l.google.com:19302"
                        }
                    ]
                });
                setInterval(() => {
                    rtc.getStatsFromPeers();
                }, 2000);
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
                document.querySelector("#apply-constraints").addEventListener("click", () => {
                    rtc.applyBandwithConstraints(250);
                });
                navigator.mediaDevices.getUserMedia({
                    audio: false, video: {
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
    let test = new Main();
});
