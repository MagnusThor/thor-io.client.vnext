"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("..");
var Main = (function () {
    function Main() {
        var key = __1.Utils.newRandomString(5);
        var factory = new __1.Factory("ws://localhost:1337", ["broker"]);
        factory.onOpen = function (broker) {
            broker.onOpen = function () {
                document.querySelector("input").value = key;
                document.querySelector("button").addEventListener("click", function () {
                    rtc.e2ee.setKey(document.querySelector("input").value);
                });
                var rtc = new __1.WebRTC(broker, {}, true, key);
                rtc.onContextConnected = function (w, r) {
                    console.log("connected to ", w.id);
                };
                rtc.onContextCreated = function () {
                };
                rtc.onContextChanged = function (data) {
                    console.log("now connected to " + data.context);
                    document.querySelector("h1").textContent = data.context;
                    rtc.connectContext();
                };
                rtc.onRemoteTrack = function (track, connection, r) {
                    console.log("Got a remote stream", connection, track, r);
                    var streams = r.receiver.createEncodedStreams();
                    streams.readableStream
                        .pipeThrough(new TransformStream({
                        transform: rtc.e2ee.decode.bind(rtc.e2ee),
                    }))
                        .pipeTo(streams.writableStream);
                    document.querySelector("video#remote").srcObject = r.streams[0];
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
            broker.connect();
        };
    }
    return Main;
}());
exports.Main = Main;
document.addEventListener("DOMContentLoaded", function () {
    console.log("Starting");
    var test = new Main();
});
