import { Utils, Factory, Controller, WebRTC, ThorIOConnection, ContextConnection, E2EEBase } from '..'

export class Main {
    constructor() {

        let useE2EE = location.search.includes("e2ee");
        let randomCryptoKey = Utils.newRandomString(5);
        let factory = new Factory("wss://dev-wss.kollokvium.net/", ["broker"]);

        factory.onOpen = (signaling: Controller) => {
            /**
             *
             *
             */
            signaling.onOpen = () => {


                let e2ee = new E2EEBase(randomCryptoKey);

                let rtc = new WebRTC(signaling, {
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
                    (document.querySelector("input#e2ee-key") as HTMLInputElement).value = randomCryptoKey;
                    document.querySelector("#set-key").addEventListener("click", (e) => {
                        rtc.e2ee.setKey((document.querySelector("input#e2ee-key") as HTMLInputElement).value);
                    });
                }


                rtc.onContextDisconnected = (w: ThorIOConnection, r: RTCPeerConnection) => {
                    console.log("lost a peer", w, r);
                }

                rtc.onContextConnected = (connection: ThorIOConnection, rtcPeerConnection: RTCPeerConnection) => {
                    console.log("Connected to ", connection.id);
                };

                rtc.onContextCreated = (peer: ContextConnection) => {
                };

                rtc.onContextChanged = (data: any) => {
                    console.log(`Now connected to ${data.context}`)
                    document.querySelector("h1#context-name").textContent = data.context;
                    rtc.connectContext();
                };

                rtc.onRemoteTrackLost = (track, connection, event) => {
                    try {
                        document.querySelector(`video.t${track.id}`).remove();
                    } catch (err) {
                        console.log(`Failed to remove a track ${track.id}`);
                    }

                }

                rtc.onRemoteVideoTrack = (track: MediaStreamTrack, connection: ThorIOConnection, event: RTCTrackEvent) => {

                    console.log(`Addaed a video for connection ${connection.id}`);

                    let video = document.createElement("video");
                    video.muted = true;
                    video.classList.add(`t${track.id}`);
                    video.autoplay = true;

                    let stream: MediaStream;

                    if (useE2EE) {
                        let streams = (event as any).receiver.createEncodedStreams();
                        streams.readableStream
                            .pipeThrough(new TransformStream({
                                transform: rtc.e2ee.decode.bind(rtc.e2ee),
                            }))
                            .pipeTo(streams.writableStream);
                    }

                    if (event.streams[0]) {
                        stream = event.streams[0];
                    } else stream = new MediaStream([track]);

                    video.srcObject = stream;
                    (document.querySelector("#remote") as HTMLVideoElement).prepend(video);
                }

                document.querySelector("button#add-track").addEventListener("click", () => {
                    const gdmOptions = {
                        video: {
                            cursor: "always"
                        },
                        audio: false
                    };
                    navigator.mediaDevices["getDisplayMedia"](gdmOptions).then((e: MediaStream) => {
                        rtc.addTrackToPeers(e.getVideoTracks()[0]);
                    });



                });

                navigator.mediaDevices.getUserMedia({
                    audio: true, video: {
                        width: {
                            ideal: 640
                        }, height: { ideal: 360 }
                    }
                }).then((ms: MediaStream) => {
                    rtc.addLocalStream(ms);
                    (document.querySelector("video#local") as HTMLVideoElement).srcObject = ms;
                    rtc.changeContext(location.hash.length === 0 ? "foo" : location.hash);
                });
            };






            signaling.connect();
        }
    }
}



document.addEventListener("DOMContentLoaded", () => {
    500

    console.log("Starting");

    let test = new Main();




});