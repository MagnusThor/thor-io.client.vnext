/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./example/main.js":
/*!*************************!*\
  !*** ./example/main.js ***!
  \*************************/
/*! flagged exports */
/*! export Main [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Main = void 0;\r\nconst __1 = __webpack_require__(/*! .. */ \"./index.js\");\r\nclass Main {\r\n    constructor() {\r\n        let factory = new __1.ClientFactory(\"wss://dev-wss.kollokvium.net/\", [\"broker\"]);\r\n        factory.onOpen = (signaling) => {\r\n            signaling.onOpen = () => {\r\n                let rtc = new __1.WebRTCFactory(signaling, {\r\n                    \"sdpSemantics\": \"unified-plan\",\r\n                    \"iceTransports\": \"all\",\r\n                    \"rtcpMuxPolicy\": \"require\",\r\n                    \"bundlePolicy\": \"max-bundle\",\r\n                    \"iceServers\": [\r\n                        {\r\n                            \"urls\": \"stun:stun.l.google.com:19302\"\r\n                        }\r\n                    ]\r\n                });\r\n                setInterval(() => {\r\n                    rtc.getStatsFromPeers();\r\n                }, 2000);\r\n                rtc.onContextDisconnected = (w, r) => {\r\n                    console.log(\"lost a peer\", w, r);\r\n                };\r\n                rtc.onContextConnected = (connection, rtcPeerConnection) => {\r\n                    console.log(\"Connected to \", connection.id);\r\n                };\r\n                rtc.onContextCreated = (peer) => {\r\n                };\r\n                rtc.onContextChanged = (data) => {\r\n                    console.log(`Now connected to ${data.context}`);\r\n                    document.querySelector(\"h1#context-name\").textContent = data.context;\r\n                    rtc.connectContext();\r\n                };\r\n                rtc.onRemoteTrackLost = (track, connection, event) => {\r\n                    try {\r\n                        document.querySelector(`video.t${track.id}`).remove();\r\n                    }\r\n                    catch (err) {\r\n                        console.log(`Failed to remove a track ${track.id}`);\r\n                    }\r\n                };\r\n                rtc.onRemoteVideoTrack = (track, connection, event) => {\r\n                    console.log(`Addaed a video for connection ${connection.id}`);\r\n                    let video = document.createElement(\"video\");\r\n                    video.muted = true;\r\n                    video.classList.add(`t${track.id}`);\r\n                    video.autoplay = true;\r\n                    let stream;\r\n                    if (event.streams[0]) {\r\n                        stream = event.streams[0];\r\n                    }\r\n                    else\r\n                        stream = new MediaStream([track]);\r\n                    video.srcObject = stream;\r\n                    document.querySelector(\"#remote\").prepend(video);\r\n                };\r\n                document.querySelector(\"button#add-track\").addEventListener(\"click\", () => {\r\n                    const gdmOptions = {\r\n                        video: {\r\n                            cursor: \"always\"\r\n                        },\r\n                        audio: false\r\n                    };\r\n                    navigator.mediaDevices[\"getDisplayMedia\"](gdmOptions).then((e) => {\r\n                        rtc.addTrackToPeers(e.getVideoTracks()[0]);\r\n                    });\r\n                });\r\n                document.querySelector(\"#apply-constraints\").addEventListener(\"click\", () => {\r\n                    rtc.applyBandwithConstraints(250);\r\n                });\r\n                navigator.mediaDevices.getUserMedia({\r\n                    audio: false, video: {\r\n                        width: {\r\n                            ideal: 640\r\n                        }, height: { ideal: 360 }\r\n                    }\r\n                }).then((ms) => {\r\n                    rtc.addLocalStream(ms);\r\n                    document.querySelector(\"video#local\").srcObject = ms;\r\n                    rtc.changeContext(location.hash.length === 0 ? \"foo\" : location.hash);\r\n                });\r\n            };\r\n            signaling.connect();\r\n        };\r\n    }\r\n}\r\nexports.Main = Main;\r\ndocument.addEventListener(\"DOMContentLoaded\", () => {\r\n    let test = new Main();\r\n});\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./example/main.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! flagged exports */
/*! export BandwidthConstraints [provided] [no usage info] [missing usage info prevents renaming] */
/*! export BinaryMessage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ClientFactory [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ContextConnection [provided] [no usage info] [missing usage info prevents renaming] */
/*! export Controller [provided] [no usage info] [missing usage info prevents renaming] */
/*! export DataChannel [provided] [no usage info] [missing usage info prevents renaming] */
/*! export E2EEBase [provided] [no usage info] [missing usage info prevents renaming] */
/*! export Listener [provided] [no usage info] [missing usage info prevents renaming] */
/*! export PeerChannel [provided] [no usage info] [missing usage info prevents renaming] */
/*! export PropertyMessage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export TextMessage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export ThorIOConnection [provided] [no usage info] [missing usage info prevents renaming] */
/*! export Utils [provided] [no usage info] [missing usage info prevents renaming] */
/*! export VideoConstraints [provided] [no usage info] [missing usage info prevents renaming] */
/*! export WebRTCFactory [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.VideoConstraints = exports.ContextConnection = exports.E2EEBase = exports.Controller = exports.ThorIOConnection = exports.WebRTCFactory = exports.Utils = exports.PropertyMessage = exports.PeerChannel = exports.Listener = exports.TextMessage = exports.ClientFactory = exports.DataChannel = exports.BinaryMessage = exports.BandwidthConstraints = void 0;\r\nvar BandwidthConstraints_1 = __webpack_require__(/*! ./src/Utils/BandwidthConstraints */ \"./src/Utils/BandwidthConstraints.js\");\r\nObject.defineProperty(exports, \"BandwidthConstraints\", ({ enumerable: true, get: function () { return BandwidthConstraints_1.BandwidthConstraints; } }));\r\nvar BinaryMessage_1 = __webpack_require__(/*! ./src/Messages/BinaryMessage */ \"./src/Messages/BinaryMessage.js\");\r\nObject.defineProperty(exports, \"BinaryMessage\", ({ enumerable: true, get: function () { return BinaryMessage_1.BinaryMessage; } }));\r\nvar DataChannel_1 = __webpack_require__(/*! ./src/DataChannels/DataChannel */ \"./src/DataChannels/DataChannel.js\");\r\nObject.defineProperty(exports, \"DataChannel\", ({ enumerable: true, get: function () { return DataChannel_1.DataChannel; } }));\r\nvar ClientFactory_1 = __webpack_require__(/*! ./src/Factory/ClientFactory */ \"./src/Factory/ClientFactory.js\");\r\nObject.defineProperty(exports, \"ClientFactory\", ({ enumerable: true, get: function () { return ClientFactory_1.ClientFactory; } }));\r\nvar TextMessage_1 = __webpack_require__(/*! ./src/Messages/TextMessage */ \"./src/Messages/TextMessage.js\");\r\nObject.defineProperty(exports, \"TextMessage\", ({ enumerable: true, get: function () { return TextMessage_1.TextMessage; } }));\r\nvar Listener_1 = __webpack_require__(/*! ./src/Events/Listener */ \"./src/Events/Listener.js\");\r\nObject.defineProperty(exports, \"Listener\", ({ enumerable: true, get: function () { return Listener_1.Listener; } }));\r\nvar PeerChannel_1 = __webpack_require__(/*! ./src/DataChannels/PeerChannel */ \"./src/DataChannels/PeerChannel.js\");\r\nObject.defineProperty(exports, \"PeerChannel\", ({ enumerable: true, get: function () { return PeerChannel_1.PeerChannel; } }));\r\nvar PropertyMessage_1 = __webpack_require__(/*! ./src/Messages/PropertyMessage */ \"./src/Messages/PropertyMessage.js\");\r\nObject.defineProperty(exports, \"PropertyMessage\", ({ enumerable: true, get: function () { return PropertyMessage_1.PropertyMessage; } }));\r\nvar Utils_1 = __webpack_require__(/*! ./src/Utils/Utils */ \"./src/Utils/Utils.js\");\r\nObject.defineProperty(exports, \"Utils\", ({ enumerable: true, get: function () { return Utils_1.Utils; } }));\r\nvar WebRTCFactory_1 = __webpack_require__(/*! ./src/Factory/WebRTCFactory */ \"./src/Factory/WebRTCFactory.js\");\r\nObject.defineProperty(exports, \"WebRTCFactory\", ({ enumerable: true, get: function () { return WebRTCFactory_1.WebRTCFactory; } }));\r\nvar ThorIOConnection_1 = __webpack_require__(/*! ./src/Factory/Models/ThorIOConnection */ \"./src/Factory/Models/ThorIOConnection.js\");\r\nObject.defineProperty(exports, \"ThorIOConnection\", ({ enumerable: true, get: function () { return ThorIOConnection_1.ThorIOConnection; } }));\r\nvar Controller_1 = __webpack_require__(/*! ./src/Controller/Controller */ \"./src/Controller/Controller.js\");\r\nObject.defineProperty(exports, \"Controller\", ({ enumerable: true, get: function () { return Controller_1.Controller; } }));\r\nvar E2EEBase_1 = __webpack_require__(/*! ./src/E2EE/E2EEBase */ \"./src/E2EE/E2EEBase.js\");\r\nObject.defineProperty(exports, \"E2EEBase\", ({ enumerable: true, get: function () { return E2EEBase_1.E2EEBase; } }));\r\nvar ContextConnection_1 = __webpack_require__(/*! ./src/Factory/Models/ContextConnection */ \"./src/Factory/Models/ContextConnection.js\");\r\nObject.defineProperty(exports, \"ContextConnection\", ({ enumerable: true, get: function () { return ContextConnection_1.ContextConnection; } }));\r\nvar Constraints_1 = __webpack_require__(/*! ./src/Utils/Constraints */ \"./src/Utils/Constraints.js\");\r\nObject.defineProperty(exports, \"VideoConstraints\", ({ enumerable: true, get: function () { return Constraints_1.VideoConstraints; } }));\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./index.js?");

/***/ }),

/***/ "./src/Controller/Controller.js":
/*!**************************************!*\
  !*** ./src/Controller/Controller.js ***!
  \**************************************/
/*! flagged exports */
/*! export Controller [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Controller = void 0;\r\nconst TextMessage_1 = __webpack_require__(/*! ../Messages/TextMessage */ \"./src/Messages/TextMessage.js\");\r\nconst Listener_1 = __webpack_require__(/*! ../Events/Listener */ \"./src/Events/Listener.js\");\r\nclass Controller {\r\n    constructor(alias, ws) {\r\n        this.alias = alias;\r\n        this.ws = ws;\r\n        this.listeners = new Map();\r\n        this.isConnected = false;\r\n        this.on(\"___error\", (err) => {\r\n            this.onError(err);\r\n        });\r\n    }\r\n    onError(event) { }\r\n    onOpen(event) { }\r\n    onClose(event) { }\r\n    connect() {\r\n        this.ws.send(new TextMessage_1.TextMessage(\"___connect\", {}, this.alias, null, null, true).toString());\r\n        return this;\r\n    }\r\n    ;\r\n    close() {\r\n        this.ws.send(new TextMessage_1.TextMessage(\"___close\", {}, this.alias, null, null, true).toString());\r\n        return this;\r\n    }\r\n    ;\r\n    subscribe(topic, callback) {\r\n        this.ws.send(new TextMessage_1.TextMessage(\"___subscribe\", {\r\n            topic: topic,\r\n            controller: this.alias\r\n        }, this.alias).toString());\r\n        return this.on(topic, callback);\r\n    }\r\n    unsubscribe(topic) {\r\n        this.ws.send(new TextMessage_1.TextMessage(\"___unsubscribe\", {\r\n            topic: topic,\r\n            controller: this.alias\r\n        }, this.alias).toString());\r\n    }\r\n    on(topic, fn) {\r\n        let listener = new Listener_1.Listener(topic, fn);\r\n        this.listeners.set(topic, listener);\r\n        return listener;\r\n    }\r\n    of(topic) {\r\n        this.listeners.delete(topic);\r\n    }\r\n    findListener(topic) {\r\n        return this.listeners.get(topic);\r\n    }\r\n    invokeBinary(buffer) {\r\n        if (buffer instanceof ArrayBuffer) {\r\n            this.ws.send(buffer);\r\n            return this;\r\n        }\r\n        else {\r\n            throw (\"parameter provided must be an ArrayBuffer constructed by BinaryMessage\");\r\n        }\r\n    }\r\n    publishBinary(buffer) {\r\n        if (buffer instanceof ArrayBuffer) {\r\n            this.ws.send(buffer);\r\n            return this;\r\n        }\r\n        else {\r\n            throw (\"parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage\");\r\n        }\r\n    }\r\n    invoke(method, data, controller) {\r\n        this.ws.send(new TextMessage_1.TextMessage(method, data, controller || this.alias, null, null, true).toString());\r\n        return this;\r\n    }\r\n    publish(topic, data, controller) {\r\n        this.invoke(topic, data, controller || this.alias);\r\n        return this;\r\n    }\r\n    setProperty(propName, propValue, controller) {\r\n        this.invoke(propName, propValue, controller || this.alias);\r\n        return this;\r\n    }\r\n    dispatch(topic, data, buffer) {\r\n        if (topic === \"___open\") {\r\n            this.isConnected = true;\r\n            this.onOpen(JSON.parse(data));\r\n            return;\r\n        }\r\n        else if (topic === \"___close\") {\r\n            this.onClose([JSON.parse(data)]);\r\n            this.isConnected = false;\r\n        }\r\n        else {\r\n            let listener = this.findListener(topic);\r\n            if (listener)\r\n                listener.fn(JSON.parse(data), buffer);\r\n        }\r\n    }\r\n}\r\nexports.Controller = Controller;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Controller/Controller.js?");

/***/ }),

/***/ "./src/DataChannels/DataChannel.js":
/*!*****************************************!*\
  !*** ./src/DataChannels/DataChannel.js ***!
  \*****************************************/
/*! flagged exports */
/*! export DataChannel [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.DataChannel = void 0;\r\nconst TextMessage_1 = __webpack_require__(/*! ../Messages/TextMessage */ \"./src/Messages/TextMessage.js\");\r\nconst DataChannelListner_1 = __webpack_require__(/*! ./DataChannelListner */ \"./src/DataChannels/DataChannelListner.js\");\r\nconst BinaryMessage_1 = __webpack_require__(/*! ../Messages/BinaryMessage */ \"./src/Messages/BinaryMessage.js\");\r\nconst Utils_1 = __webpack_require__(/*! ../Utils/Utils */ \"./src/Utils/Utils.js\");\r\nclass DataChannel {\r\n    constructor(label, listeners) {\r\n        this.Listners = listeners || new Map();\r\n        this.PeerChannels = new Map();\r\n        this.label = label;\r\n        this.messageFragments = new Map();\r\n    }\r\n    findListener(topic) {\r\n        let listener = Array.from(this.Listners.values()).find((pre) => {\r\n            return pre.channelName === this.label && pre.topic === topic;\r\n        });\r\n        return listener;\r\n    }\r\n    on(topic, fn) {\r\n        var listener = new DataChannelListner_1.DataChannelListner(this.label, topic, fn);\r\n        this.Listners.set(topic, listener);\r\n        return listener;\r\n    }\r\n    off(topic) {\r\n        return this.Listners.delete(topic);\r\n    }\r\n    onOpen(event, peerId, name) { }\r\n    onClose(event, peerId, name) { }\r\n    addMessageFragment(message) {\r\n        if (!this.messageFragments.has(message.I)) {\r\n            const data = { msg: message, receiveBuffer: new ArrayBuffer(0) };\r\n            data.receiveBuffer = Utils_1.Utils.joinBuffers(data.receiveBuffer, message.B);\r\n            this.messageFragments.set(message.I, data);\r\n        }\r\n        else {\r\n            let current = this.messageFragments.get(message.I);\r\n            current.receiveBuffer = Utils_1.Utils.joinBuffers(current.receiveBuffer, message.B);\r\n        }\r\n        if (message.F) {\r\n            let result = this.messageFragments.get(message.I);\r\n            result.msg.B = result.receiveBuffer;\r\n            this.dispatchMessage(result.msg);\r\n            this.messageFragments.delete(message.I);\r\n        }\r\n        message.B = new ArrayBuffer(0);\r\n    }\r\n    dispatchMessage(msg) {\r\n        let listener = this.findListener(msg.T);\r\n        listener && listener.fn.apply(this, [JSON.parse(msg.D), msg.B]);\r\n    }\r\n    onMessage(event) {\r\n        const isBinary = typeof (event.data) !== \"string\";\r\n        if (isBinary) {\r\n            this.addMessageFragment(BinaryMessage_1.BinaryMessage.fromArrayBuffer(event.data));\r\n        }\r\n        else {\r\n            this.dispatchMessage(JSON.parse(event.data));\r\n        }\r\n    }\r\n    close(name) {\r\n        this.PeerChannels.forEach((pc) => {\r\n            if (pc.dataChannel.label === name || this.label)\r\n                pc.dataChannel.close();\r\n        });\r\n    }\r\n    invoke(topic, data, isFinal, uuid) {\r\n        this.PeerChannels.forEach((channel) => {\r\n            if (channel.dataChannel.readyState === \"open\" && channel.label === this.label) {\r\n                channel.dataChannel.send(new TextMessage_1.TextMessage(topic, data, channel.label, null, uuid, isFinal).toString());\r\n            }\r\n        });\r\n        return this;\r\n    }\r\n    invokeBinary(topic, data, arrayBuffer, isFinal, uuid) {\r\n        let m = new TextMessage_1.TextMessage(topic, data, this.label, null, uuid, isFinal);\r\n        const message = new BinaryMessage_1.BinaryMessage(m.toString(), arrayBuffer);\r\n        this.PeerChannels.forEach((channel) => {\r\n            if (channel.dataChannel.readyState === \"open\" && channel.label === this.label) {\r\n                channel.dataChannel.send(message.buffer);\r\n            }\r\n        });\r\n        return this;\r\n    }\r\n    addPeerChannel(pc) {\r\n        this.PeerChannels.set({\r\n            id: pc.peerId, name: pc.label\r\n        }, pc);\r\n    }\r\n    removePeerChannel(id) {\r\n        return this.PeerChannels.delete({ id: id, name: this.label });\r\n    }\r\n}\r\nexports.DataChannel = DataChannel;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/DataChannels/DataChannel.js?");

/***/ }),

/***/ "./src/DataChannels/DataChannelListner.js":
/*!************************************************!*\
  !*** ./src/DataChannels/DataChannelListner.js ***!
  \************************************************/
/*! flagged exports */
/*! export DataChannelListner [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.DataChannelListner = void 0;\r\nconst Listener_1 = __webpack_require__(/*! ../Events/Listener */ \"./src/Events/Listener.js\");\r\nclass DataChannelListner extends Listener_1.Listener {\r\n    constructor(channelName, topic, fn) {\r\n        super(topic, fn);\r\n        this.channelName = channelName;\r\n        this.count = 0;\r\n    }\r\n}\r\nexports.DataChannelListner = DataChannelListner;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/DataChannels/DataChannelListner.js?");

/***/ }),

/***/ "./src/DataChannels/PeerChannel.js":
/*!*****************************************!*\
  !*** ./src/DataChannels/PeerChannel.js ***!
  \*****************************************/
/*! flagged exports */
/*! export PeerChannel [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.PeerChannel = void 0;\r\nclass PeerChannel {\r\n    constructor(peerId, dataChannel, label) {\r\n        this.peerId = peerId;\r\n        this.dataChannel = dataChannel;\r\n        this.label = label;\r\n    }\r\n}\r\nexports.PeerChannel = PeerChannel;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/DataChannels/PeerChannel.js?");

/***/ }),

/***/ "./src/E2EE/E2EEBase.js":
/*!******************************!*\
  !*** ./src/E2EE/E2EEBase.js ***!
  \******************************/
/*! flagged exports */
/*! export E2EEBase [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.E2EEBase = void 0;\r\nclass E2EEBase {\r\n    constructor(currentCryptoKey) {\r\n        this.currentCryptoKey = currentCryptoKey;\r\n        this.frameTypeToCryptoOffset = {\r\n            key: 10,\r\n            delta: 3,\r\n            undefined: 1,\r\n        };\r\n        this.useCryptoOffset = true;\r\n        this.currentKeyIdentifier = 0;\r\n        this.rcount = 0;\r\n        this.scount = 0;\r\n    }\r\n    setKey(key) {\r\n        this.currentCryptoKey = key;\r\n    }\r\n    dump(encodedFrame, direction, max = 16) {\r\n        const data = new Uint8Array(encodedFrame.data);\r\n        let bytes = '';\r\n        for (let j = 0; j < data.length && j < max; j++) {\r\n            bytes += (data[j] < 16 ? '0' : '') + data[j].toString(16) + ' ';\r\n        }\r\n        console.log(performance.now().toFixed(2), direction, bytes.trim(), 'len=' + encodedFrame.data.byteLength, 'type=' + (encodedFrame.type || 'audio'), 'ts=' + encodedFrame.timestamp, 'ssrc=' + encodedFrame.synchronizationSource);\r\n    }\r\n    encode(encodedFrame, controller) {\r\n        if (this.scount++ < 30) {\r\n            this.dump(encodedFrame, 'send');\r\n        }\r\n        if (this.currentCryptoKey) {\r\n            const view = new DataView(encodedFrame.data);\r\n            const newData = new ArrayBuffer(encodedFrame.data.byteLength + 5);\r\n            const newView = new DataView(newData);\r\n            const cryptoOffset = this.useCryptoOffset ? this.frameTypeToCryptoOffset[encodedFrame.type] : 0;\r\n            for (let i = 0; i < cryptoOffset && i < encodedFrame.data.byteLength; ++i) {\r\n                newView.setInt8(i, view.getInt8(i));\r\n            }\r\n            for (let i = cryptoOffset; i < encodedFrame.data.byteLength; ++i) {\r\n                const keyByte = this.currentCryptoKey.charCodeAt(i % this.currentCryptoKey.length);\r\n                newView.setInt8(i, view.getInt8(i) ^ keyByte);\r\n            }\r\n            newView.setUint8(encodedFrame.data.byteLength, this.currentKeyIdentifier % 0xff);\r\n            newView.setUint32(encodedFrame.data.byteLength + 1, 0xDEADBEEF);\r\n            encodedFrame.data = newData;\r\n        }\r\n        controller.enqueue(encodedFrame);\r\n    }\r\n    decode(encodedFrame, controller) {\r\n        if (this.rcount++ < 30) {\r\n            this.dump(encodedFrame, 'recv');\r\n        }\r\n        const view = new DataView(encodedFrame.data);\r\n        const checksum = encodedFrame.data.byteLength > 4 ? view.getUint32(encodedFrame.data.byteLength - 4) : false;\r\n        if (this.currentCryptoKey) {\r\n            if (checksum !== 0xDEADBEEF) {\r\n                console.log('Corrupted frame received, checksum ' +\r\n                    checksum.toString(16));\r\n                return;\r\n            }\r\n            const keyIdentifier = view.getUint8(encodedFrame.data.byteLength - 5);\r\n            if (keyIdentifier !== this.currentKeyIdentifier) {\r\n                console.log(`Key identifier mismatch, got ${keyIdentifier} expected ${this.currentKeyIdentifier}.`);\r\n                return;\r\n            }\r\n            const newData = new ArrayBuffer(encodedFrame.data.byteLength - 5);\r\n            const newView = new DataView(newData);\r\n            const cryptoOffset = this.useCryptoOffset ? this.frameTypeToCryptoOffset[encodedFrame.type] : 0;\r\n            for (let i = 0; i < cryptoOffset; ++i) {\r\n                newView.setInt8(i, view.getInt8(i));\r\n            }\r\n            for (let i = cryptoOffset; i < encodedFrame.data.byteLength - 5; ++i) {\r\n                const keyByte = this.currentCryptoKey.charCodeAt(i % this.currentCryptoKey.length);\r\n                newView.setInt8(i, view.getInt8(i) ^ keyByte);\r\n            }\r\n            encodedFrame.data = newData;\r\n        }\r\n        else if (checksum === 0xDEADBEEF) {\r\n            return;\r\n        }\r\n        controller.enqueue(encodedFrame);\r\n    }\r\n}\r\nexports.E2EEBase = E2EEBase;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/E2EE/E2EEBase.js?");

/***/ }),

/***/ "./src/Events/Listener.js":
/*!********************************!*\
  !*** ./src/Events/Listener.js ***!
  \********************************/
/*! flagged exports */
/*! export Listener [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Listener = void 0;\r\nclass Listener {\r\n    constructor(topic, fn) {\r\n        this.fn = fn;\r\n        this.topic = topic;\r\n        this.count = 0;\r\n    }\r\n}\r\nexports.Listener = Listener;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Events/Listener.js?");

/***/ }),

/***/ "./src/Factory/ClientFactory.js":
/*!**************************************!*\
  !*** ./src/Factory/ClientFactory.js ***!
  \**************************************/
/*! flagged exports */
/*! export ClientFactory [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.ClientFactory = void 0;\r\nconst BinaryMessage_1 = __webpack_require__(/*! ../Messages/BinaryMessage */ \"./src/Messages/BinaryMessage.js\");\r\nconst Controller_1 = __webpack_require__(/*! ../Controller/Controller */ \"./src/Controller/Controller.js\");\r\nclass ClientFactory {\r\n    constructor(url, controllers, params) {\r\n        this.url = url;\r\n        this.controllers = new Map();\r\n        this.ws = new WebSocket(url + this.toQuery(params || {}));\r\n        this.ws.binaryType = \"arraybuffer\";\r\n        controllers.forEach(alias => {\r\n            this.controllers.set(alias, new Controller_1.Controller(alias, this.ws));\r\n        });\r\n        this.ws.onmessage = event => {\r\n            if (typeof (event.data) !== \"object\") {\r\n                let message = JSON.parse(event.data);\r\n                this.getController(message.C).dispatch(message.T, message.D);\r\n            }\r\n            else {\r\n                let message = BinaryMessage_1.BinaryMessage.fromArrayBuffer(event.data);\r\n                this.getController(message.C).dispatch(message.T, message.D, message.B);\r\n            }\r\n        };\r\n        this.ws.onclose = event => {\r\n            this.IsConnected = false;\r\n            this.onClose.apply(this, [event]);\r\n        };\r\n        this.ws.onerror = error => {\r\n            this.onError.apply(this, [error]);\r\n        };\r\n        this.ws.onopen = event => {\r\n            this.IsConnected = true;\r\n            this.onOpen.apply(this, Array.from(this.controllers.values()));\r\n        };\r\n    }\r\n    toQuery(obj) {\r\n        return `?${Object.keys(obj).map(key => (encodeURIComponent(key) + \"=\" +\r\n            encodeURIComponent(obj[key]))).join(\"&\")}`;\r\n    }\r\n    close() {\r\n        this.ws.close();\r\n    }\r\n    getController(alias) {\r\n        return this.controllers.get(alias);\r\n    }\r\n    removeController(alias) {\r\n        this.controllers.delete(alias);\r\n    }\r\n    onOpen(controllers) { }\r\n    onError(error) { }\r\n    onClose(event) { }\r\n}\r\nexports.ClientFactory = ClientFactory;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Factory/ClientFactory.js?");

/***/ }),

/***/ "./src/Factory/Models/ContextConnection.js":
/*!*************************************************!*\
  !*** ./src/Factory/Models/ContextConnection.js ***!
  \*************************************************/
/*! flagged exports */
/*! export ContextConnection [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.ContextConnection = void 0;\r\nclass ContextConnection {\r\n}\r\nexports.ContextConnection = ContextConnection;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Factory/Models/ContextConnection.js?");

/***/ }),

/***/ "./src/Factory/Models/ThorIOConnection.js":
/*!************************************************!*\
  !*** ./src/Factory/Models/ThorIOConnection.js ***!
  \************************************************/
/*! flagged exports */
/*! export ThorIOConnection [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.ThorIOConnection = void 0;\r\nconst Utils_1 = __webpack_require__(/*! ../../Utils/Utils */ \"./src/Utils/Utils.js\");\r\nclass ThorIOConnection {\r\n    constructor(id, rtcPeerConnection) {\r\n        this.id = id;\r\n        this.peerConnection = rtcPeerConnection;\r\n        this.uuid = Utils_1.Utils.newGuid();\r\n    }\r\n    getSenders() {\r\n        return this.peerConnection.getSenders();\r\n    }\r\n    getReceivers() {\r\n        return this.peerConnection.getReceivers();\r\n    }\r\n    getTransceivers() {\r\n        return this.peerConnection.getTransceivers();\r\n    }\r\n}\r\nexports.ThorIOConnection = ThorIOConnection;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Factory/Models/ThorIOConnection.js?");

/***/ }),

/***/ "./src/Factory/WebRTCFactory.js":
/*!**************************************!*\
  !*** ./src/Factory/WebRTCFactory.js ***!
  \**************************************/
/*! flagged exports */
/*! export WebRTCFactory [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.WebRTCFactory = void 0;\r\nconst ThorIOConnection_1 = __webpack_require__(/*! ./Models/ThorIOConnection */ \"./src/Factory/Models/ThorIOConnection.js\");\r\nconst BandwidthConstraints_1 = __webpack_require__(/*! ../Utils/BandwidthConstraints */ \"./src/Utils/BandwidthConstraints.js\");\r\nconst DataChannel_1 = __webpack_require__(/*! ../DataChannels/DataChannel */ \"./src/DataChannels/DataChannel.js\");\r\nconst PeerChannel_1 = __webpack_require__(/*! ../DataChannels/PeerChannel */ \"./src/DataChannels/PeerChannel.js\");\r\nclass WebRTCFactory {\r\n    constructor(signalingController, rtcConfig, e2ee) {\r\n        this.signalingController = signalingController;\r\n        this.rtcConfig = rtcConfig;\r\n        if (e2ee) {\r\n            this.isEncrypted = true;\r\n            this.e2ee = e2ee;\r\n        }\r\n        else {\r\n            this.isEncrypted = false;\r\n        }\r\n        this.localStreams = new Array();\r\n        this.dataChannels = new Map();\r\n        this.peers = new Map();\r\n        this.signalingController.on(\"contextSignal\", (signal) => {\r\n            let msg = JSON.parse(signal.message);\r\n            switch (msg.type) {\r\n                case \"offer\":\r\n                    this.onOffer(signal, signal.skipLocalTracks || false);\r\n                    break;\r\n                case \"answer\":\r\n                    this.onAnswer(signal);\r\n                    break;\r\n                case \"candidate\":\r\n                    this.onCandidate(signal);\r\n                    break;\r\n            }\r\n        });\r\n        this.signalingController.on(\"contextCreated\", (peer) => {\r\n            this.localPeerId = peer.peerId;\r\n            this.context = peer.context;\r\n            this.onContextCreated(peer);\r\n        });\r\n        this.signalingController.on(\"contextChanged\", (context) => {\r\n            this.context = context;\r\n            this.onContextChanged(context);\r\n        });\r\n        this.signalingController.on(\"connectTo\", (peers) => {\r\n            this.onConnectAll(peers);\r\n        });\r\n    }\r\n    onConnectAll(peerConnections) {\r\n        this.connect(peerConnections);\r\n    }\r\n    onConnected(peerId) {\r\n        if (this.onContextConnected)\r\n            this.onContextConnected(this.findPeerConnection(peerId), this.getOrCreateRTCPeerConnection(peerId));\r\n    }\r\n    onDisconnected(peerId) {\r\n        let peerConnection = this.getOrCreateRTCPeerConnection(peerId);\r\n        if (this.onContextDisconnected)\r\n            this.onContextDisconnected(this.findPeerConnection(peerId), peerConnection);\r\n        peerConnection.close();\r\n        this.removePeerConnection(peerId);\r\n    }\r\n    addTrackToPeers(track) {\r\n        this.peers.forEach((p) => {\r\n            let pc = p.peerConnection;\r\n            pc.onnegotiationneeded = (e) => {\r\n                pc.createOffer()\r\n                    .then(offer => pc.setLocalDescription(offer))\r\n                    .then(() => {\r\n                    let offer = {\r\n                        sender: this.localPeerId,\r\n                        recipient: p.id,\r\n                        message: JSON.stringify(pc.localDescription),\r\n                        skipLocalTracks: true\r\n                    };\r\n                    this.signalingController.invoke(\"contextSignal\", offer);\r\n                });\r\n            };\r\n        });\r\n    }\r\n    removeTrackFromPeers(track) {\r\n        this.peers.forEach((p) => {\r\n            let sender = p.getSenders().find((sender) => {\r\n                return sender.track.id === track.id;\r\n            });\r\n            p.peerConnection.removeTrack(sender);\r\n        });\r\n    }\r\n    getRtpSenders(peerId) {\r\n        if (!this.peers.has(peerId))\r\n            throw \"Cannot find the peer\";\r\n        return this.peers.get(peerId).getSenders();\r\n    }\r\n    getRtpReceivers(peerId) {\r\n        if (!this.peers.has(peerId))\r\n            throw \"Cannot find the peer\";\r\n        return this.peers.get(peerId).getReceivers();\r\n    }\r\n    setBandwithConstraints(videobandwidth, audiobandwidth) {\r\n        this.bandwidthConstraints = new BandwidthConstraints_1.BandwidthConstraints(videobandwidth, audiobandwidth);\r\n    }\r\n    setMediaBitrates(sdp) {\r\n        return this.setMediaBitrate(this.setMediaBitrate(sdp, \"video\", this.bandwidthConstraints.videobandwidth), \"audio\", this.bandwidthConstraints.audiobandwidth);\r\n    }\r\n    setMediaBitrate(sdp, media, bitrate) {\r\n        let lines = sdp.split(\"\\n\");\r\n        let line = -1;\r\n        for (let i = 0; i < lines.length; i++) {\r\n            if (lines[i].indexOf(\"m=\" + media) === 0) {\r\n                line = i;\r\n                break;\r\n            }\r\n        }\r\n        if (line === -1) {\r\n            return sdp;\r\n        }\r\n        line++;\r\n        while (lines[line].indexOf(\"i=\") === 0 || lines[line].indexOf(\"c=\") === 0) {\r\n            line++;\r\n        }\r\n        if (lines[line].indexOf(\"b\") === 0) {\r\n            lines[line] = \"b=AS:\" + bitrate;\r\n            return lines.join(\"\\n\");\r\n        }\r\n        var newLines = lines.slice(0, line);\r\n        newLines.push(\"b=AS:\" + bitrate);\r\n        newLines = newLines.concat(lines.slice(line, lines.length));\r\n        return newLines.join(\"\\n\");\r\n    }\r\n    createDataChannel(name) {\r\n        let channel = new DataChannel_1.DataChannel(name);\r\n        this.dataChannels.set(name, channel);\r\n        return channel;\r\n    }\r\n    removeDataChannel(name) {\r\n        this.dataChannels.delete(name);\r\n    }\r\n    addError(err) {\r\n        this.onError(err);\r\n    }\r\n    onCandidate(event) {\r\n        let msg = JSON.parse(event.message);\r\n        let candidate = msg.iceCandidate;\r\n        let pc = this.getOrCreateRTCPeerConnection(event.sender);\r\n        pc.addIceCandidate(new RTCIceCandidate(candidate)).then(() => {\r\n        }).catch((err) => {\r\n            this.addError(err);\r\n        });\r\n    }\r\n    onAnswer(event) {\r\n        let pc = this.getOrCreateRTCPeerConnection(event.sender);\r\n        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message))).then((p) => {\r\n        }).catch((err) => {\r\n            this.addError(err);\r\n        });\r\n    }\r\n    onOffer(event, skipLocalTracks) {\r\n        let pc = this.getOrCreateRTCPeerConnection(event.sender);\r\n        if (!skipLocalTracks) {\r\n            this.localStreams.forEach((stream) => {\r\n                stream.getTracks().forEach((track) => {\r\n                    let rtpSender = pc.addTrack(track, stream);\r\n                    if (this.isEncrypted) {\r\n                        let streams = rtpSender.createEncodedStreams();\r\n                        streams.readableStream\r\n                            .pipeThrough(new TransformStream({\r\n                            transform: this.e2ee.encode.bind(this.e2ee),\r\n                        }))\r\n                            .pipeTo(streams.writableStream);\r\n                    }\r\n                });\r\n            });\r\n        }\r\n        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message)));\r\n        pc.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then((description) => {\r\n            pc.setLocalDescription(description).then(() => {\r\n                if (this.bandwidthConstraints)\r\n                    description.sdp = this.setMediaBitrates(description.sdp);\r\n                let answer = {\r\n                    sender: this.localPeerId,\r\n                    recipient: event.sender,\r\n                    message: JSON.stringify(description)\r\n                };\r\n                this.signalingController.invoke(\"contextSignal\", answer);\r\n            }).catch((err) => this.addError(err));\r\n        }).catch((err) => this.addError(err));\r\n    }\r\n    getStatsFromPeers() {\r\n        let lastResult;\r\n        this.peers.forEach((p) => {\r\n            let sender = p.getSenders().find((sender) => {\r\n                sender.getStats().then(res => {\r\n                    res.forEach(report => {\r\n                        let bytes;\r\n                        let headerBytes;\r\n                        let packets;\r\n                        if (report.type === 'outbound-rtp') {\r\n                            if (report.isRemote) {\r\n                                return;\r\n                            }\r\n                            const now = report.timestamp;\r\n                            bytes = report.bytesSent;\r\n                            headerBytes = report.headerBytesSent;\r\n                            packets = report.packetsSent;\r\n                            console.log(bytes);\r\n                        }\r\n                    });\r\n                });\r\n            });\r\n        });\r\n    }\r\n    applyBandwithConstraints(bandwidth) {\r\n        this.peers.forEach((p) => {\r\n            let sender = p.getSenders().find((sender) => {\r\n                const parameters = sender.getParameters();\r\n                if (!parameters.encodings) {\r\n                    parameters.encodings = [{}];\r\n                }\r\n                if (parameters.encodings[0]) {\r\n                    parameters.encodings[0].maxBitrate = bandwidth * 1000;\r\n                    sender.setParameters(parameters).then(() => {\r\n                        console.log(\"applyBandwithConstraints successfully applied\");\r\n                    }).catch(e => {\r\n                        console.error(e);\r\n                    });\r\n                }\r\n            });\r\n        });\r\n    }\r\n    async setVideoConstraints(sender, height, frameRate) {\r\n    }\r\n    addLocalStream(stream) {\r\n        this.localStreams.push(stream);\r\n        return this;\r\n    }\r\n    addIceServer(iceServer) {\r\n        this.rtcConfig.iceServers.push(iceServer);\r\n        return this;\r\n    }\r\n    removePeerConnection(id) {\r\n        this.peers.delete(id);\r\n    }\r\n    createRTCPeerConnection(id) {\r\n        let config;\r\n        if (this.isEncrypted) {\r\n            config = this.rtcConfig;\r\n            config.encodedInsertableStreams = true;\r\n            config.forceEncodedVideoInsertableStreams = true;\r\n            config.forceEncodedAudioInsertableStreams = true;\r\n        }\r\n        else {\r\n            config = this.rtcConfig;\r\n        }\r\n        let rtcPeerConnection = new RTCPeerConnection(config);\r\n        rtcPeerConnection.onsignalingstatechange = (state) => { };\r\n        rtcPeerConnection.onicecandidate = (event) => {\r\n            if (!event || !event.candidate)\r\n                return;\r\n            if (event.candidate) {\r\n                let msg = {\r\n                    sender: this.localPeerId,\r\n                    recipient: id,\r\n                    message: JSON.stringify({\r\n                        type: 'candidate',\r\n                        iceCandidate: event.candidate\r\n                    })\r\n                };\r\n                this.signalingController.invoke(\"contextSignal\", msg);\r\n            }\r\n        };\r\n        rtcPeerConnection.oniceconnectionstatechange = (event) => {\r\n            switch (event.target.iceConnectionState) {\r\n                case \"connected\":\r\n                    this.onConnected(id);\r\n                    break;\r\n                case \"disconnected\":\r\n                    this.cleanUp(id);\r\n                    this.onDisconnected(id);\r\n                    break;\r\n            }\r\n        };\r\n        rtcPeerConnection.ontrack = (event) => {\r\n            const track = event.track;\r\n            const kind = event.track.kind;\r\n            const connection = this.peers.get(id);\r\n            event.track.onended = (e) => {\r\n                if (this.onRemoteTrackLost)\r\n                    this.onRemoteTrackLost(track, connection, e);\r\n            };\r\n            if (kind === \"video\" && this.onRemoteVideoTrack) {\r\n                this.onRemoteVideoTrack(track, connection, event);\r\n            }\r\n            else if (kind === \"audio\" && this.onRemoteAudioTrack) {\r\n                this.onRemoteAudioTrack(track, connection, event);\r\n            }\r\n            if (this.onRemoteTrack)\r\n                this.onRemoteTrack(track, connection, event);\r\n        };\r\n        this.dataChannels.forEach((dataChannel) => {\r\n            let pc = new PeerChannel_1.PeerChannel(id, rtcPeerConnection.createDataChannel(dataChannel.label), dataChannel.label);\r\n            dataChannel.addPeerChannel(pc);\r\n            rtcPeerConnection.ondatachannel = (event) => {\r\n                let channel = event.channel;\r\n                channel.onopen = (event) => {\r\n                    this.dataChannels.get(channel.label).onOpen(event, id, channel.label);\r\n                };\r\n                channel.onclose = (event) => {\r\n                    this.dataChannels.get(channel.label).removePeerChannel(id);\r\n                    this.dataChannels.get(channel.label).onClose(event, id, channel.label);\r\n                };\r\n                channel.onmessage = (message) => {\r\n                    this.dataChannels.get(channel.label).onMessage(message);\r\n                };\r\n            };\r\n        });\r\n        return rtcPeerConnection;\r\n    }\r\n    cleanUp(id) {\r\n        this.dataChannels.forEach((d) => {\r\n            d.removePeerChannel(id);\r\n        });\r\n    }\r\n    findPeerConnection(id) {\r\n        return this.peers.get(id);\r\n    }\r\n    reconnectAll() {\r\n        throw \"not yet implemeted\";\r\n    }\r\n    getOrCreateRTCPeerConnection(id) {\r\n        let match = this.peers.get(id);\r\n        if (!match) {\r\n            let pc = new ThorIOConnection_1.ThorIOConnection(id, this.createRTCPeerConnection(id));\r\n            this.peers.set(id, pc);\r\n            return pc.peerConnection;\r\n        }\r\n        return match.peerConnection;\r\n    }\r\n    createOffer(peer) {\r\n        let peerConnection = this.createRTCPeerConnection(peer.peerId);\r\n        this.localStreams.forEach((stream) => {\r\n            stream.getTracks().forEach((track) => {\r\n                const rtpSender = peerConnection.addTrack(track, stream);\r\n                const maxBitrate = 50000;\r\n                const sourceWidth = 640;\r\n                const sendWidth = 320;\r\n                let params = rtpSender.getParameters();\r\n                console.log(`create offer`, params, params.encodings);\r\n                const constraints = { encodings: [{ maxBitrate: 5000, scaleResolutionDownBy: 1 }] };\r\n                rtpSender.setParameters(constraints);\r\n                console.log(rtpSender);\r\n                if (this.isEncrypted) {\r\n                    let senderStreams = rtpSender.createEncodedStreams();\r\n                    senderStreams.readableStream\r\n                        .pipeThrough(new TransformStream({\r\n                        transform: this.e2ee.encode.bind(this.e2ee),\r\n                    }))\r\n                        .pipeTo(senderStreams.writableStream);\r\n                }\r\n            });\r\n            if (this.onLocalStream)\r\n                this.onLocalStream(stream);\r\n        });\r\n        peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then((description) => {\r\n            peerConnection.setLocalDescription(description).then(() => {\r\n                if (this.bandwidthConstraints)\r\n                    description.sdp = this.setMediaBitrates(description.sdp);\r\n                let offer = {\r\n                    sender: this.localPeerId,\r\n                    recipient: peer.peerId,\r\n                    message: JSON.stringify(description)\r\n                };\r\n                this.signalingController.invoke(\"contextSignal\", offer);\r\n            }).catch((err) => {\r\n                this.addError(err);\r\n            });\r\n        }).catch((err) => {\r\n            this.addError(err);\r\n        });\r\n        return peerConnection;\r\n    }\r\n    disconnect() {\r\n        this.peers.forEach((connection) => {\r\n            connection.peerConnection.close();\r\n        });\r\n        this.changeContext(Math.random().toString(36).substring(2));\r\n    }\r\n    disconnectPeer(id) {\r\n        let peer = this.findPeerConnection(id);\r\n        peer.peerConnection.close();\r\n    }\r\n    connect(peerConnections) {\r\n        peerConnections.forEach((peerConnection) => {\r\n            this.connectTo(peerConnection);\r\n        });\r\n    }\r\n    connectTo(peerConnection) {\r\n        let pc = new ThorIOConnection_1.ThorIOConnection(peerConnection.peerId, this.createOffer(peerConnection));\r\n        if (!this.peers.has(peerConnection.peerId))\r\n            this.peers.set(peerConnection.peerId, pc);\r\n    }\r\n    changeContext(context) {\r\n        this.signalingController.invoke(\"changeContext\", { context: context });\r\n        return this;\r\n    }\r\n    connectPeers() {\r\n        this.signalingController.invoke(\"connectContext\", {});\r\n    }\r\n    connectContext() {\r\n        this.connectPeers();\r\n    }\r\n}\r\nexports.WebRTCFactory = WebRTCFactory;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Factory/WebRTCFactory.js?");

/***/ }),

/***/ "./src/Messages/BinaryMessage.js":
/*!***************************************!*\
  !*** ./src/Messages/BinaryMessage.js ***!
  \***************************************/
/*! flagged exports */
/*! export BinaryMessage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.BinaryMessage = void 0;\r\nconst Utils_1 = __webpack_require__(/*! ../Utils/Utils */ \"./src/Utils/Utils.js\");\r\nconst TextMessage_1 = __webpack_require__(/*! ./TextMessage */ \"./src/Messages/TextMessage.js\");\r\nclass BinaryMessage {\r\n    constructor(message, arrayBuffer) {\r\n        this.arrayBuffer = arrayBuffer;\r\n        this.header = new Uint8Array(Utils_1.Utils.longToArray(message.length));\r\n        this.buffer = Utils_1.Utils.joinBuffers(Utils_1.Utils.joinBuffers(this.header.buffer, Utils_1.Utils.stingToBuffer(message).buffer), arrayBuffer);\r\n    }\r\n    static fromArrayBuffer(buffer) {\r\n        let bytes = new Uint8Array(buffer);\r\n        let header = bytes.slice(0, 8);\r\n        let payloadLength = Utils_1.Utils.arrayToLong(header);\r\n        let start = header.byteLength + payloadLength;\r\n        let bytesMessage = bytes.slice(header.byteLength, start);\r\n        let stop = buffer.byteLength;\r\n        let messageBuffer = bytes.slice(start, stop);\r\n        let textMessage = String.fromCharCode.apply(null, new Uint16Array(bytesMessage));\r\n        let message = JSON.parse(textMessage);\r\n        return new TextMessage_1.TextMessage(message.T, message.D, message.C, messageBuffer, message.I, message.F);\r\n    }\r\n}\r\nexports.BinaryMessage = BinaryMessage;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Messages/BinaryMessage.js?");

/***/ }),

/***/ "./src/Messages/PropertyMessage.js":
/*!*****************************************!*\
  !*** ./src/Messages/PropertyMessage.js ***!
  \*****************************************/
/*! flagged exports */
/*! export PropertyMessage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.PropertyMessage = void 0;\r\nconst Utils_1 = __webpack_require__(/*! ../Utils/Utils */ \"./src/Utils/Utils.js\");\r\nclass PropertyMessage {\r\n    constructor() {\r\n        this.messageId = Utils_1.Utils.newGuid();\r\n    }\r\n}\r\nexports.PropertyMessage = PropertyMessage;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Messages/PropertyMessage.js?");

/***/ }),

/***/ "./src/Messages/TextMessage.js":
/*!*************************************!*\
  !*** ./src/Messages/TextMessage.js ***!
  \*************************************/
/*! flagged exports */
/*! export TextMessage [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__ */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.TextMessage = void 0;\r\nconst BinaryMessage_1 = __webpack_require__(/*! ./BinaryMessage */ \"./src/Messages/BinaryMessage.js\");\r\nconst Utils_1 = __webpack_require__(/*! ../Utils/Utils */ \"./src/Utils/Utils.js\");\r\nclass TextMessage {\r\n    constructor(topic, object, controller, buffer, uuid, isFinal) {\r\n        this.D = object;\r\n        this.T = topic;\r\n        this.C = controller;\r\n        this.B = buffer;\r\n        this.I = uuid || Utils_1.Utils.newGuid();\r\n        this.F = isFinal;\r\n    }\r\n    toJSON() {\r\n        return {\r\n            T: this.T,\r\n            D: JSON.stringify(this.D),\r\n            C: this.C,\r\n            I: this.I,\r\n            F: this.F\r\n        };\r\n    }\r\n    toString() {\r\n        return JSON.stringify(this.toJSON());\r\n    }\r\n    static fromArrayBuffer(buffer) {\r\n        return BinaryMessage_1.BinaryMessage.fromArrayBuffer(buffer);\r\n    }\r\n}\r\nexports.TextMessage = TextMessage;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Messages/TextMessage.js?");

/***/ }),

/***/ "./src/Utils/BandwidthConstraints.js":
/*!*******************************************!*\
  !*** ./src/Utils/BandwidthConstraints.js ***!
  \*******************************************/
/*! flagged exports */
/*! export BandwidthConstraints [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.BandwidthConstraints = void 0;\r\nclass BandwidthConstraints {\r\n    constructor(videobandwidth, audiobandwidth) {\r\n        this.videobandwidth = videobandwidth;\r\n        this.audiobandwidth = audiobandwidth;\r\n    }\r\n}\r\nexports.BandwidthConstraints = BandwidthConstraints;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Utils/BandwidthConstraints.js?");

/***/ }),

/***/ "./src/Utils/Constraints.js":
/*!**********************************!*\
  !*** ./src/Utils/Constraints.js ***!
  \**********************************/
/*! flagged exports */
/*! export VideoConstraints [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.VideoConstraints = void 0;\r\nclass VideoConstraints {\r\n    constructor(bitrate, height) {\r\n        this.bitrate = bitrate;\r\n        this.height = height;\r\n    }\r\n    async setVideoParams(sender) {\r\n        await sender.track.applyConstraints({ height: this.height });\r\n    }\r\n}\r\nexports.VideoConstraints = VideoConstraints;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Utils/Constraints.js?");

/***/ }),

/***/ "./src/Utils/Utils.js":
/*!****************************!*\
  !*** ./src/Utils/Utils.js ***!
  \****************************/
/*! flagged exports */
/*! export Utils [provided] [no usage info] [missing usage info prevents renaming] */
/*! export __esModule [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__ */
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.Utils = void 0;\r\nclass Utils {\r\n    static stingToBuffer(str) {\r\n        let len = str.length;\r\n        var arr = new Array(len);\r\n        for (let i = 0; i < len; i++) {\r\n            arr[i] = str.charCodeAt(i) & 0xFF;\r\n        }\r\n        return new Uint8Array(arr);\r\n    }\r\n    static arrayToLong(byteArray) {\r\n        var value = 0;\r\n        let byteLength = byteArray.byteLength;\r\n        for (let i = byteLength - 1; i >= 0; i--) {\r\n            value = (value * 256) + byteArray[i];\r\n        }\r\n        return value;\r\n    }\r\n    static longToArray(long) {\r\n        var byteArray = new Uint8Array(8);\r\n        let byteLength = byteArray.length;\r\n        for (let index = 0; index < byteLength; index++) {\r\n            let byte = long & 0xff;\r\n            byteArray[index] = byte;\r\n            long = (long - byte) / 256;\r\n        }\r\n        return byteArray;\r\n    }\r\n    static newGuid() {\r\n        const s4 = () => {\r\n            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);\r\n        };\r\n        return s4() + s4() + \"-\" + s4() + \"-\" + s4() + \"-\" + s4() + \"-\" + s4() + s4() + s4();\r\n    }\r\n    static newRandomString(length) {\r\n        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);\r\n    }\r\n    static joinBuffers(a, b) {\r\n        let newBuffer = new Uint8Array(a.byteLength + b.byteLength);\r\n        newBuffer.set(new Uint8Array(a), 0);\r\n        newBuffer.set(new Uint8Array(b), a.byteLength);\r\n        return newBuffer.buffer;\r\n    }\r\n}\r\nexports.Utils = Utils;\r\n\n\n//# sourceURL=webpack://thor-io.client-vnext/./src/Utils/Utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./example/main.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;