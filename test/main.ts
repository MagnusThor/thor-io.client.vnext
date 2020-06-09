import { Factory, Controller, WebRTC, Utils } from "..";
import { WebRTCConnection } from '../src/WebRTC/WebRTCConnection';

export class Main {





    constructor() {

        let key = Utils.newRandomString(5);

        let factory = new Factory("wss://dev-wss.kollokvium.net/", ["broker"]);
        factory.onOpen = (broker: Controller) => {
            /**
             *
             *
             */
            broker.onOpen = () => {


                document.querySelector("input").value = key;

                document.querySelector("button").addEventListener("click", () => {
                    rtc.e2ee.setKey(document.querySelector("input").value);
                });


                let rtc = new WebRTC(broker, {
                }, true, key);



                rtc.onContextConnected = (w, r) => {


                    console.log("connected to ", w.id);

                }

                rtc.onContextCreated = () => {

                };

                rtc.onContextChanged = (data: any) => {
                    console.log(`now connected to ${data.context}`)

                    document.querySelector("h1").textContent = data.context;

                    rtc.connectContext();
                };


                rtc.onRemoteTrack = (track: MediaStreamTrack, connection: WebRTCConnection, r: RTCTrackEvent) => {
                    console.log("Got a remote stream", connection, track, r);

                    let streams = (r as any).receiver.createEncodedStreams();
                    streams.readableStream
                        .pipeThrough(new TransformStream({
                            transform: rtc.e2ee.decode.bind(rtc.e2ee),
                        }))
                        .pipeTo(streams.writableStream);



                    (document.querySelector("video#remote") as HTMLVideoElement).srcObject = r.streams[0];


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




            broker.connect();


        }




    }


}



document.addEventListener("DOMContentLoaded", () => {

    console.log("Starting");

    let test = new Main();



});