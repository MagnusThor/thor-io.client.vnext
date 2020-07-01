import { Factory, Controller, WebRTC, Utils } from "..";
import { WebRTCConnection } from '../src/WebRTC/WebRTCConnection';
import { PeerConnection } from '../src/WebRTC/PeerConnection';
import { E2EEBase } from '../src/E2EE/EncodeDecode';

export class Main {

    constructor() {

        let randomCryptoKey = Utils.newRandomString(5);
        let factory = new Factory("wss://dev-wss.kollokvium.net/", ["broker"]);

        factory.onOpen = (signaling: Controller) => {
            /**
             *
             *
             */
            signaling.onOpen = () => {

                (document.querySelector("input#e2ee-key") as HTMLInputElement).value = randomCryptoKey;

                // ch
                document.querySelector("button#set-key").addEventListener("click", () => {
                    rtc.e2ee.setKey(document.querySelector("input").value);
                });

                let e2ee = new E2EEBase(randomCryptoKey);

                let rtc = new WebRTC(signaling, {
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

                rtc.onContextConnected = (connection:WebRTCConnection, rtcPeerConnection:RTCPeerConnection) => {
                    console.log("Connected to ", connection.id);
                };

                rtc.onContextCreated = (peer:PeerConnection) => {
                };

                rtc.onContextChanged = (data: any) => {
                    console.log(`Now connected to ${data.context}`)
                    document.querySelector("h1#context-name").textContent = data.context;
                    rtc.connectContext();
                };

                rtc.onRemoteTrack = (track: MediaStreamTrack, connection: WebRTCConnection, event: RTCTrackEvent) => {
                    console.log("Got a remote stream", connection, track, event);
                                   
                    let streams = (event as any).receiver.createEncodedStreams();
                 
                    streams.readableStream
                        .pipeThrough(new TransformStream({
                            transform: rtc.e2ee.decode.bind(rtc.e2ee),
                        }))
                        .pipeTo(streams.writableStream);
                    (document.querySelector("video#remote") as HTMLVideoElement).srcObject = event.streams[0];

                }

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

    console.log("Starting");

    let test = new Main();



});