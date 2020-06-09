/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar BandwidthConstraints_1 = __webpack_require__(/*! ./src/WebRTC/BandwidthConstraints */ \"./src/WebRTC/BandwidthConstraints.js\");\nexports.BandwidthConstraints = BandwidthConstraints_1.BandwidthConstraints;\nvar BinaryMessage_1 = __webpack_require__(/*! ./src/Messages/BinaryMessage */ \"./src/Messages/BinaryMessage.js\");\nexports.BinaryMessage = BinaryMessage_1.BinaryMessage;\nvar DataChannel_1 = __webpack_require__(/*! ./src/WebRTC/DataChannel */ \"./src/WebRTC/DataChannel.js\");\nexports.DataChannel = DataChannel_1.DataChannel;\nvar Factory_1 = __webpack_require__(/*! ./src/Factory */ \"./src/Factory.js\");\nexports.Factory = Factory_1.Factory;\nvar TextMessage_1 = __webpack_require__(/*! ./src/Messages/TextMessage */ \"./src/Messages/TextMessage.js\");\nexports.Message = TextMessage_1.TextMessage;\nvar Listener_1 = __webpack_require__(/*! ./src/Listener */ \"./src/Listener.js\");\nexports.Listener = Listener_1.Listener;\nvar PeerChannel_1 = __webpack_require__(/*! ./src/WebRTC/PeerChannel */ \"./src/WebRTC/PeerChannel.js\");\nexports.PeerChannel = PeerChannel_1.PeerChannel;\nvar PropertyMessage_1 = __webpack_require__(/*! ./src/Messages/PropertyMessage */ \"./src/Messages/PropertyMessage.js\");\nexports.PropertyMessage = PropertyMessage_1.PropertyMessage;\nvar Controller_1 = __webpack_require__(/*! ./src/Controller */ \"./src/Controller.js\");\nexports.Proxy = Controller_1.Controller;\nvar Utils_1 = __webpack_require__(/*! ./src/Utils/Utils */ \"./src/Utils/Utils.js\");\nexports.Utils = Utils_1.Utils;\nvar WebRTC_1 = __webpack_require__(/*! ./src/WebRTC/WebRTC */ \"./src/WebRTC/WebRTC.js\");\nexports.WebRTC = WebRTC_1.WebRTC;\nvar WebRTCConnection_1 = __webpack_require__(/*! ./src/WebRTC/WebRTCConnection */ \"./src/WebRTC/WebRTCConnection.js\");\nexports.WebRTCConnection = WebRTCConnection_1.WebRTCConnection;\nvar Controller_2 = __webpack_require__(/*! ./src/Controller */ \"./src/Controller.js\");\nexports.Controller = Controller_2.Controller;\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./src/Controller.js":
/*!***************************!*\
  !*** ./src/Controller.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar TextMessage_1 = __webpack_require__(/*! ./Messages/TextMessage */ \"./src/Messages/TextMessage.js\");\nvar Listener_1 = __webpack_require__(/*! ./Listener */ \"./src/Listener.js\");\nvar Controller = (function () {\n    function Controller(alias, ws) {\n        var _this = this;\n        this.alias = alias;\n        this.ws = ws;\n        this.listeners = new Map();\n        this.IsConnected = false;\n        this.on(\"___error\", function (err) {\n            _this.onError(err);\n        });\n    }\n    Controller.prototype.onError = function (event) { };\n    Controller.prototype.onOpen = function (event) { };\n    Controller.prototype.onClose = function (event) { };\n    Controller.prototype.connect = function () {\n        this.ws.send(new TextMessage_1.TextMessage(\"___connect\", {}, this.alias, null, null, true).toString());\n        return this;\n    };\n    ;\n    Controller.prototype.close = function () {\n        this.ws.send(new TextMessage_1.TextMessage(\"___close\", {}, this.alias, null, null, true).toString());\n        return this;\n    };\n    ;\n    Controller.prototype.subscribe = function (topic, callback) {\n        this.ws.send(new TextMessage_1.TextMessage(\"___subscribe\", {\n            topic: topic,\n            controller: this.alias\n        }, this.alias).toString());\n        return this.on(topic, callback);\n    };\n    Controller.prototype.unsubscribe = function (topic) {\n        this.ws.send(new TextMessage_1.TextMessage(\"___unsubscribe\", {\n            topic: topic,\n            controller: this.alias\n        }, this.alias).toString());\n    };\n    Controller.prototype.on = function (topic, fn) {\n        var listener = new Listener_1.Listener(topic, fn);\n        this.listeners.set(topic, listener);\n        return listener;\n    };\n    Controller.prototype.of = function (topic) {\n        this.listeners.delete(topic);\n    };\n    Controller.prototype.findListener = function (topic) {\n        return this.listeners.get(topic);\n    };\n    Controller.prototype.invokeBinary = function (buffer) {\n        if (buffer instanceof ArrayBuffer) {\n            this.ws.send(buffer);\n            return this;\n        }\n        else {\n            throw (\"parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage\");\n        }\n    };\n    Controller.prototype.publishBinary = function (buffer) {\n        if (buffer instanceof ArrayBuffer) {\n            this.ws.send(buffer);\n            return this;\n        }\n        else {\n            throw (\"parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage\");\n        }\n    };\n    Controller.prototype.invoke = function (method, data, controller) {\n        this.ws.send(new TextMessage_1.TextMessage(method, data, controller || this.alias, null, null, true).toString());\n        return this;\n    };\n    Controller.prototype.publish = function (topic, data, controller) {\n        this.invoke(topic, data, controller || this.alias);\n        return this;\n    };\n    Controller.prototype.setProperty = function (propName, propValue, controller) {\n        this.invoke(propName, propValue, controller || this.alias);\n        return this;\n    };\n    Controller.prototype.dispatch = function (topic, data, buffer) {\n        if (topic === \"___open\") {\n            this.IsConnected = true;\n            this.onOpen(JSON.parse(data));\n            return;\n        }\n        else if (topic === \"___close\") {\n            this.onClose([JSON.parse(data)]);\n            this.IsConnected = false;\n        }\n        else {\n            var listener = this.findListener(topic);\n            if (listener)\n                listener.fn(JSON.parse(data), buffer);\n        }\n    };\n    return Controller;\n}());\nexports.Controller = Controller;\n\n\n//# sourceURL=webpack:///./src/Controller.js?");

/***/ }),

/***/ "./src/DataChannels/DataChannelListner.js":
/*!************************************************!*\
  !*** ./src/DataChannels/DataChannelListner.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Listener_1 = __webpack_require__(/*! ../Listener */ \"./src/Listener.js\");\nvar DataChannelListner = (function (_super) {\n    __extends(DataChannelListner, _super);\n    function DataChannelListner(channelName, topic, fn) {\n        var _this = _super.call(this, topic, fn) || this;\n        _this.channelName = channelName;\n        _this.count = 0;\n        return _this;\n    }\n    return DataChannelListner;\n}(Listener_1.Listener));\nexports.DataChannelListner = DataChannelListner;\n\n\n//# sourceURL=webpack:///./src/DataChannels/DataChannelListner.js?");

/***/ }),

/***/ "./src/E2EE/EncodeDecode.js":
/*!**********************************!*\
  !*** ./src/E2EE/EncodeDecode.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar E2EEBase = (function () {\n    function E2EEBase(currentCryptoKey) {\n        this.currentCryptoKey = currentCryptoKey;\n        this.frameTypeToCryptoOffset = {\n            key: 10,\n            delta: 3,\n            undefined: 1,\n        };\n        this.useCryptoOffset = true;\n        this.currentKeyIdentifier = 0;\n        this.rcount = 0;\n        this.scount = 0;\n    }\n    E2EEBase.prototype.setKey = function (key) {\n        this.currentCryptoKey = key;\n    };\n    E2EEBase.prototype.dump = function (encodedFrame, direction, max) {\n        if (max === void 0) { max = 16; }\n        var data = new Uint8Array(encodedFrame.data);\n        var bytes = '';\n        for (var j = 0; j < data.length && j < max; j++) {\n            bytes += (data[j] < 16 ? '0' : '') + data[j].toString(16) + ' ';\n        }\n        console.log(performance.now().toFixed(2), direction, bytes.trim(), 'len=' + encodedFrame.data.byteLength, 'type=' + (encodedFrame.type || 'audio'), 'ts=' + encodedFrame.timestamp, 'ssrc=' + encodedFrame.synchronizationSource);\n    };\n    E2EEBase.prototype.encode = function (encodedFrame, controller) {\n        if (this.scount++ < 30) {\n            this.dump(encodedFrame, 'send');\n        }\n        if (this.currentCryptoKey) {\n            var view = new DataView(encodedFrame.data);\n            var newData = new ArrayBuffer(encodedFrame.data.byteLength + 5);\n            var newView = new DataView(newData);\n            var cryptoOffset = this.useCryptoOffset ? this.frameTypeToCryptoOffset[encodedFrame.type] : 0;\n            for (var i = 0; i < cryptoOffset && i < encodedFrame.data.byteLength; ++i) {\n                newView.setInt8(i, view.getInt8(i));\n            }\n            for (var i = cryptoOffset; i < encodedFrame.data.byteLength; ++i) {\n                var keyByte = this.currentCryptoKey.charCodeAt(i % this.currentCryptoKey.length);\n                newView.setInt8(i, view.getInt8(i) ^ keyByte);\n            }\n            newView.setUint8(encodedFrame.data.byteLength, this.currentKeyIdentifier % 0xff);\n            newView.setUint32(encodedFrame.data.byteLength + 1, 0xDEADBEEF);\n            encodedFrame.data = newData;\n        }\n        controller.enqueue(encodedFrame);\n    };\n    E2EEBase.prototype.decode = function (encodedFrame, controller) {\n        if (this.rcount++ < 30) {\n            this.dump(encodedFrame, 'recv');\n        }\n        var view = new DataView(encodedFrame.data);\n        var checksum = encodedFrame.data.byteLength > 4 ? view.getUint32(encodedFrame.data.byteLength - 4) : false;\n        if (this.currentCryptoKey) {\n            if (checksum !== 0xDEADBEEF) {\n                console.log('Corrupted frame received, checksum ' +\n                    checksum.toString(16));\n                return;\n            }\n            var keyIdentifier = view.getUint8(encodedFrame.data.byteLength - 5);\n            if (keyIdentifier !== this.currentKeyIdentifier) {\n                console.log(\"Key identifier mismatch, got \" + keyIdentifier + \" expected \" + this.currentKeyIdentifier + \".\");\n                return;\n            }\n            var newData = new ArrayBuffer(encodedFrame.data.byteLength - 5);\n            var newView = new DataView(newData);\n            var cryptoOffset = this.useCryptoOffset ? this.frameTypeToCryptoOffset[encodedFrame.type] : 0;\n            for (var i = 0; i < cryptoOffset; ++i) {\n                newView.setInt8(i, view.getInt8(i));\n            }\n            for (var i = cryptoOffset; i < encodedFrame.data.byteLength - 5; ++i) {\n                var keyByte = this.currentCryptoKey.charCodeAt(i % this.currentCryptoKey.length);\n                newView.setInt8(i, view.getInt8(i) ^ keyByte);\n            }\n            encodedFrame.data = newData;\n        }\n        else if (checksum === 0xDEADBEEF) {\n            return;\n        }\n        controller.enqueue(encodedFrame);\n    };\n    return E2EEBase;\n}());\nexports.E2EEBase = E2EEBase;\n\n\n//# sourceURL=webpack:///./src/E2EE/EncodeDecode.js?");

/***/ }),

/***/ "./src/Factory.js":
/*!************************!*\
  !*** ./src/Factory.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar BinaryMessage_1 = __webpack_require__(/*! ./Messages/BinaryMessage */ \"./src/Messages/BinaryMessage.js\");\nvar Controller_1 = __webpack_require__(/*! ./Controller */ \"./src/Controller.js\");\nvar Factory = (function () {\n    function Factory(url, controllers, params) {\n        var _this = this;\n        this.url = url;\n        this.controllers = new Map();\n        this.ws = new WebSocket(url + this.toQuery(params || {}));\n        this.ws.binaryType = \"arraybuffer\";\n        controllers.forEach(function (alias) {\n            _this.controllers.set(alias, new Controller_1.Controller(alias, _this.ws));\n        });\n        this.ws.onmessage = function (event) {\n            if (typeof (event.data) !== \"object\") {\n                var message = JSON.parse(event.data);\n                _this.getController(message.C).dispatch(message.T, message.D);\n            }\n            else {\n                var message = BinaryMessage_1.BinaryMessage.fromArrayBuffer(event.data);\n                _this.getController(message.C).dispatch(message.T, message.D, message.B);\n            }\n        };\n        this.ws.onclose = function (event) {\n            _this.IsConnected = false;\n            _this.onClose.apply(_this, [event]);\n        };\n        this.ws.onerror = function (error) {\n            _this.onError.apply(_this, [error]);\n        };\n        this.ws.onopen = function (event) {\n            _this.IsConnected = true;\n            _this.onOpen.apply(_this, Array.from(_this.controllers.values()));\n        };\n    }\n    Factory.prototype.toQuery = function (obj) {\n        return \"?\" + Object.keys(obj).map(function (key) { return (encodeURIComponent(key) + \"=\" +\n            encodeURIComponent(obj[key])); }).join(\"&\");\n    };\n    Factory.prototype.close = function () {\n        this.ws.close();\n    };\n    Factory.prototype.getController = function (alias) {\n        return this.controllers.get(alias);\n    };\n    Factory.prototype.removeController = function (alias) {\n        this.controllers.delete(alias);\n    };\n    Factory.prototype.onOpen = function (controllers) { };\n    Factory.prototype.onError = function (error) { };\n    Factory.prototype.onClose = function (event) { };\n    return Factory;\n}());\nexports.Factory = Factory;\n\n\n//# sourceURL=webpack:///./src/Factory.js?");

/***/ }),

/***/ "./src/Listener.js":
/*!*************************!*\
  !*** ./src/Listener.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Listener = (function () {\n    function Listener(topic, fn) {\n        this.fn = fn;\n        this.topic = topic;\n        this.count = 0;\n    }\n    return Listener;\n}());\nexports.Listener = Listener;\n\n\n//# sourceURL=webpack:///./src/Listener.js?");

/***/ }),

/***/ "./src/Messages/BinaryMessage.js":
/*!***************************************!*\
  !*** ./src/Messages/BinaryMessage.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Utils_1 = __webpack_require__(/*! ../Utils/Utils */ \"./src/Utils/Utils.js\");\nvar TextMessage_1 = __webpack_require__(/*! ./TextMessage */ \"./src/Messages/TextMessage.js\");\nvar BinaryMessage = (function () {\n    function BinaryMessage(message, arrayBuffer) {\n        this.arrayBuffer = arrayBuffer;\n        this.header = new Uint8Array(Utils_1.Utils.longToArray(message.length));\n        this.buffer = Utils_1.Utils.joinBuffers(Utils_1.Utils.joinBuffers(this.header.buffer, Utils_1.Utils.stingToBuffer(message).buffer), arrayBuffer);\n    }\n    BinaryMessage.fromArrayBuffer = function (buffer) {\n        var bytes = new Uint8Array(buffer);\n        var header = bytes.slice(0, 8);\n        var payloadLength = Utils_1.Utils.arrayToLong(header);\n        var start = header.byteLength + payloadLength;\n        var bytesMessage = bytes.slice(header.byteLength, start);\n        var stop = buffer.byteLength;\n        var messageBuffer = bytes.slice(start, stop);\n        var textMessage = String.fromCharCode.apply(null, new Uint16Array(bytesMessage));\n        var message = JSON.parse(textMessage);\n        return new TextMessage_1.TextMessage(message.T, message.D, message.C, messageBuffer, message.I, message.F);\n    };\n    return BinaryMessage;\n}());\nexports.BinaryMessage = BinaryMessage;\n\n\n//# sourceURL=webpack:///./src/Messages/BinaryMessage.js?");

/***/ }),

/***/ "./src/Messages/PropertyMessage.js":
/*!*****************************************!*\
  !*** ./src/Messages/PropertyMessage.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Utils_1 = __webpack_require__(/*! ../Utils/Utils */ \"./src/Utils/Utils.js\");\nvar PropertyMessage = (function () {\n    function PropertyMessage() {\n        this.messageId = Utils_1.Utils.newGuid();\n    }\n    return PropertyMessage;\n}());\nexports.PropertyMessage = PropertyMessage;\n\n\n//# sourceURL=webpack:///./src/Messages/PropertyMessage.js?");

/***/ }),

/***/ "./src/Messages/TextMessage.js":
/*!*************************************!*\
  !*** ./src/Messages/TextMessage.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar BinaryMessage_1 = __webpack_require__(/*! ./BinaryMessage */ \"./src/Messages/BinaryMessage.js\");\nvar Utils_1 = __webpack_require__(/*! ../Utils/Utils */ \"./src/Utils/Utils.js\");\nvar TextMessage = (function () {\n    function TextMessage(topic, object, controller, buffer, uuid, isFinal) {\n        this.D = object;\n        this.T = topic;\n        this.C = controller;\n        this.B = buffer;\n        this.I = uuid || Utils_1.Utils.newGuid();\n        this.F = isFinal;\n    }\n    Object.defineProperty(TextMessage.prototype, \"JSON\", {\n        get: function () {\n            return {\n                T: this.T,\n                D: JSON.stringify(this.D),\n                C: this.C,\n                I: this.I,\n                F: this.F\n            };\n        },\n        enumerable: true,\n        configurable: true\n    });\n    TextMessage.prototype.toString = function () {\n        return JSON.stringify(this.JSON);\n    };\n    TextMessage.fromArrayBuffer = function (buffer) {\n        return BinaryMessage_1.BinaryMessage.fromArrayBuffer(buffer);\n    };\n    return TextMessage;\n}());\nexports.TextMessage = TextMessage;\n\n\n//# sourceURL=webpack:///./src/Messages/TextMessage.js?");

/***/ }),

/***/ "./src/Utils/Utils.js":
/*!****************************!*\
  !*** ./src/Utils/Utils.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar Utils = (function () {\n    function Utils() {\n    }\n    Utils.stingToBuffer = function (str) {\n        var len = str.length;\n        var arr = new Array(len);\n        for (var i = 0; i < len; i++) {\n            arr[i] = str.charCodeAt(i) & 0xFF;\n        }\n        return new Uint8Array(arr);\n    };\n    Utils.arrayToLong = function (byteArray) {\n        var value = 0;\n        var byteLength = byteArray.byteLength;\n        for (var i = byteLength - 1; i >= 0; i--) {\n            value = (value * 256) + byteArray[i];\n        }\n        return value;\n    };\n    Utils.longToArray = function (long) {\n        var byteArray = new Uint8Array(8);\n        var byteLength = byteArray.length;\n        for (var index = 0; index < byteLength; index++) {\n            var byte = long & 0xff;\n            byteArray[index] = byte;\n            long = (long - byte) / 256;\n        }\n        return byteArray;\n    };\n    Utils.newGuid = function () {\n        var s4 = function () {\n            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);\n        };\n        return s4() + s4() + \"-\" + s4() + \"-\" + s4() + \"-\" + s4() + \"-\" + s4() + s4() + s4();\n    };\n    Utils.newRandomString = function (length) {\n        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);\n    };\n    Utils.joinBuffers = function (a, b) {\n        var newBuffer = new Uint8Array(a.byteLength + b.byteLength);\n        newBuffer.set(new Uint8Array(a), 0);\n        newBuffer.set(new Uint8Array(b), a.byteLength);\n        return newBuffer.buffer;\n    };\n    return Utils;\n}());\nexports.Utils = Utils;\n\n\n//# sourceURL=webpack:///./src/Utils/Utils.js?");

/***/ }),

/***/ "./src/WebRTC/BandwidthConstraints.js":
/*!********************************************!*\
  !*** ./src/WebRTC/BandwidthConstraints.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar BandwidthConstraints = (function () {\n    function BandwidthConstraints(videobandwidth, audiobandwidth) {\n        this.videobandwidth = videobandwidth;\n        this.audiobandwidth = audiobandwidth;\n    }\n    return BandwidthConstraints;\n}());\nexports.BandwidthConstraints = BandwidthConstraints;\n\n\n//# sourceURL=webpack:///./src/WebRTC/BandwidthConstraints.js?");

/***/ }),

/***/ "./src/WebRTC/DataChannel.js":
/*!***********************************!*\
  !*** ./src/WebRTC/DataChannel.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar TextMessage_1 = __webpack_require__(/*! ../Messages/TextMessage */ \"./src/Messages/TextMessage.js\");\nvar DataChannelListner_1 = __webpack_require__(/*! ../DataChannels/DataChannelListner */ \"./src/DataChannels/DataChannelListner.js\");\nvar BinaryMessage_1 = __webpack_require__(/*! ../Messages/BinaryMessage */ \"./src/Messages/BinaryMessage.js\");\nvar Utils_1 = __webpack_require__(/*! ../Utils/Utils */ \"./src/Utils/Utils.js\");\nvar DataChannel = (function () {\n    function DataChannel(label, listeners) {\n        this.Listners = listeners || new Map();\n        this.PeerChannels = new Map();\n        this.label = label;\n        this.messageFragments = new Map();\n    }\n    DataChannel.prototype.findListener = function (topic) {\n        var _this = this;\n        var listener = Array.from(this.Listners.values()).find(function (pre) {\n            return pre.channelName === _this.label && pre.topic === topic;\n        });\n        return listener;\n    };\n    DataChannel.prototype.on = function (topic, fn) {\n        var listener = new DataChannelListner_1.DataChannelListner(this.label, topic, fn);\n        this.Listners.set(topic, listener);\n        return listener;\n    };\n    DataChannel.prototype.off = function (topic) {\n        return this.Listners.delete(topic);\n    };\n    DataChannel.prototype.onOpen = function (event, peerId, name) { };\n    DataChannel.prototype.onClose = function (event, peerId, name) { };\n    DataChannel.prototype.addMessageFragment = function (message) {\n        if (!this.messageFragments.has(message.I)) {\n            var data = { msg: message, receiveBuffer: new ArrayBuffer(0) };\n            data.receiveBuffer = Utils_1.Utils.joinBuffers(data.receiveBuffer, message.B);\n            this.messageFragments.set(message.I, data);\n        }\n        else {\n            var current = this.messageFragments.get(message.I);\n            current.receiveBuffer = Utils_1.Utils.joinBuffers(current.receiveBuffer, message.B);\n        }\n        if (message.F) {\n            var result = this.messageFragments.get(message.I);\n            result.msg.B = result.receiveBuffer;\n            this.dispatchMessage(result.msg);\n            this.messageFragments.delete(message.I);\n        }\n        message.B = new ArrayBuffer(0);\n    };\n    DataChannel.prototype.dispatchMessage = function (msg) {\n        var listener = this.findListener(msg.T);\n        listener && listener.fn.apply(this, [JSON.parse(msg.D), msg.B]);\n    };\n    DataChannel.prototype.onMessage = function (event) {\n        var isBinary = typeof (event.data) !== \"string\";\n        if (isBinary) {\n            this.addMessageFragment(BinaryMessage_1.BinaryMessage.fromArrayBuffer(event.data));\n        }\n        else {\n            this.dispatchMessage(JSON.parse(event.data));\n        }\n    };\n    DataChannel.prototype.close = function (name) {\n        var _this = this;\n        this.PeerChannels.forEach(function (pc) {\n            if (pc.dataChannel.label === name || _this.label)\n                pc.dataChannel.close();\n        });\n    };\n    DataChannel.prototype.invoke = function (topic, data, isFinal, uuid) {\n        var _this = this;\n        this.PeerChannels.forEach(function (channel) {\n            if (channel.dataChannel.readyState === \"open\" && channel.label === _this.label) {\n                channel.dataChannel.send(new TextMessage_1.TextMessage(topic, data, channel.label, null, uuid, isFinal).toString());\n            }\n        });\n        return this;\n    };\n    DataChannel.prototype.invokeBinary = function (topic, data, arrayBuffer, isFinal, uuid) {\n        var _this = this;\n        var m = new TextMessage_1.TextMessage(topic, data, this.label, null, uuid, isFinal);\n        var message = new BinaryMessage_1.BinaryMessage(m.toString(), arrayBuffer);\n        this.PeerChannels.forEach(function (channel) {\n            if (channel.dataChannel.readyState === \"open\" && channel.label === _this.label) {\n                channel.dataChannel.send(message.buffer);\n            }\n        });\n        return this;\n    };\n    DataChannel.prototype.addPeerChannel = function (pc) {\n        this.PeerChannels.set({\n            id: pc.peerId, name: pc.label\n        }, pc);\n    };\n    DataChannel.prototype.removePeerChannel = function (id) {\n        return this.PeerChannels.delete({ id: id, name: this.label });\n    };\n    return DataChannel;\n}());\nexports.DataChannel = DataChannel;\n\n\n//# sourceURL=webpack:///./src/WebRTC/DataChannel.js?");

/***/ }),

/***/ "./src/WebRTC/PeerChannel.js":
/*!***********************************!*\
  !*** ./src/WebRTC/PeerChannel.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar PeerChannel = (function () {\n    function PeerChannel(peerId, dataChannel, label) {\n        this.peerId = peerId;\n        this.dataChannel = dataChannel;\n        this.label = label;\n    }\n    return PeerChannel;\n}());\nexports.PeerChannel = PeerChannel;\n\n\n//# sourceURL=webpack:///./src/WebRTC/PeerChannel.js?");

/***/ }),

/***/ "./src/WebRTC/WebRTC.js":
/*!******************************!*\
  !*** ./src/WebRTC/WebRTC.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar WebRTCConnection_1 = __webpack_require__(/*! ./WebRTCConnection */ \"./src/WebRTC/WebRTCConnection.js\");\nvar PeerChannel_1 = __webpack_require__(/*! ./PeerChannel */ \"./src/WebRTC/PeerChannel.js\");\nvar DataChannel_1 = __webpack_require__(/*! ./DataChannel */ \"./src/WebRTC/DataChannel.js\");\nvar BandwidthConstraints_1 = __webpack_require__(/*! ./BandwidthConstraints */ \"./src/WebRTC/BandwidthConstraints.js\");\nvar EncodeDecode_1 = __webpack_require__(/*! ../E2EE/EncodeDecode */ \"./src/E2EE/EncodeDecode.js\");\nvar WebRTC = (function () {\n    function WebRTC(brokerController, rtcConfig, encrypted, cryptoKey) {\n        var _this = this;\n        this.brokerController = brokerController;\n        this.rtcConfig = rtcConfig;\n        this.encrypted = encrypted;\n        if (this.encrypted) {\n            this.e2ee = new EncodeDecode_1.E2EEBase(cryptoKey);\n        }\n        this.errors = new Array();\n        this.localStreams = new Array();\n        this.dataChannels = new Map();\n        this.peers = new Map();\n        this.brokerController.on(\"contextSignal\", function (signal) {\n            var msg = JSON.parse(signal.message);\n            switch (msg.type) {\n                case \"offer\":\n                    _this.onOffer(signal, signal.skipLocalTracks || false);\n                    break;\n                case \"answer\":\n                    _this.onAnswer(signal);\n                    break;\n                case \"candidate\":\n                    _this.onCandidate(signal);\n                    break;\n            }\n        });\n        brokerController.on(\"contextCreated\", function (peer) {\n            _this.localPeerId = peer.peerId;\n            _this.context = peer.context;\n            _this.onContextCreated(peer);\n        });\n        brokerController.on(\"contextChanged\", function (context) {\n            _this.context = context;\n            _this.onContextChanged(context);\n        });\n        brokerController.on(\"connectTo\", function (peers) {\n            _this.onConnectTo(peers);\n        });\n    }\n    WebRTC.prototype.onConnectTo = function (peerConnections) {\n        this.connect(peerConnections);\n    };\n    WebRTC.prototype.onConnected = function (peerId) {\n        if (this.onContextConnected)\n            this.onContextConnected(this.findPeerConnection(peerId), this.getPeerConnection(peerId));\n    };\n    WebRTC.prototype.onDisconnected = function (peerId) {\n        var peerConnection = this.getPeerConnection(peerId);\n        if (this.onContextDisconnected)\n            this.onContextDisconnected(this.findPeerConnection(peerId), peerConnection);\n        peerConnection.close();\n        this.removePeerConnection(peerId);\n    };\n    WebRTC.prototype.addTrackToPeers = function (track) {\n        var _this = this;\n        this.peers.forEach(function (p) {\n            var pc = p.RTCPeer;\n            pc.onnegotiationneeded = function (e) {\n                pc.createOffer()\n                    .then(function (offer) { return pc.setLocalDescription(offer); })\n                    .then(function () {\n                    var offer = {\n                        sender: _this.localPeerId,\n                        recipient: p.id,\n                        message: JSON.stringify(pc.localDescription),\n                        skipLocalTracks: true\n                    };\n                    _this.brokerController.invoke(\"contextSignal\", offer);\n                });\n            };\n            p.RTCPeer.addTrack(track);\n        });\n    };\n    WebRTC.prototype.removeTrackFromPeers = function (track) {\n        this.peers.forEach(function (p) {\n            var sender = p.RTCPeer.getSenders().find(function (sender) {\n                return sender.track.id === track.id;\n            });\n            p.RTCPeer.removeTrack(sender);\n        });\n    };\n    WebRTC.prototype.getRtpSenders = function (peerId) {\n        if (!this.peers.has(peerId))\n            throw \"Cannot find the peer\";\n        return this.peers.get(peerId).RTCPeer.getSenders();\n    };\n    WebRTC.prototype.getRtpReceivers = function (peerId) {\n        if (!this.peers.has(peerId))\n            throw \"Cannot find the peer\";\n        return this.peers.get(peerId).RTCPeer.getReceivers();\n    };\n    WebRTC.prototype.setBandwithConstraints = function (videobandwidth, audiobandwidth) {\n        this.bandwidthConstraints = new BandwidthConstraints_1.BandwidthConstraints(videobandwidth, audiobandwidth);\n    };\n    WebRTC.prototype.setMediaBitrates = function (sdp) {\n        return this.setMediaBitrate(this.setMediaBitrate(sdp, \"video\", this.bandwidthConstraints.videobandwidth), \"audio\", this.bandwidthConstraints.audiobandwidth);\n    };\n    WebRTC.prototype.setMediaBitrate = function (sdp, media, bitrate) {\n        var lines = sdp.split(\"\\n\");\n        var line = -1;\n        for (var i = 0; i < lines.length; i++) {\n            if (lines[i].indexOf(\"m=\" + media) === 0) {\n                line = i;\n                break;\n            }\n        }\n        if (line === -1) {\n            return sdp;\n        }\n        line++;\n        while (lines[line].indexOf(\"i=\") === 0 || lines[line].indexOf(\"c=\") === 0) {\n            line++;\n        }\n        if (lines[line].indexOf(\"b\") === 0) {\n            lines[line] = \"b=AS:\" + bitrate;\n            return lines.join(\"\\n\");\n        }\n        var newLines = lines.slice(0, line);\n        newLines.push(\"b=AS:\" + bitrate);\n        newLines = newLines.concat(lines.slice(line, lines.length));\n        return newLines.join(\"\\n\");\n    };\n    WebRTC.prototype.createDataChannel = function (name) {\n        var channel = new DataChannel_1.DataChannel(name);\n        this.dataChannels.set(name, channel);\n        return channel;\n    };\n    WebRTC.prototype.removeDataChannel = function (name) {\n        this.dataChannels.delete(name);\n    };\n    WebRTC.prototype.addError = function (err) {\n        this.onError(err);\n    };\n    WebRTC.prototype.onCandidate = function (event) {\n        var _this = this;\n        var msg = JSON.parse(event.message);\n        var candidate = msg.iceCandidate;\n        var pc = this.getPeerConnection(event.sender);\n        pc.addIceCandidate(new RTCIceCandidate(candidate)).then(function () {\n        }).catch(function (err) {\n            _this.addError(err);\n        });\n    };\n    WebRTC.prototype.onAnswer = function (event) {\n        var _this = this;\n        var pc = this.getPeerConnection(event.sender);\n        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message))).then(function (p) {\n        }).catch(function (err) {\n            _this.addError(err);\n        });\n    };\n    WebRTC.prototype.onOffer = function (event, skipLocalTracks) {\n        var _this = this;\n        var pc = this.getPeerConnection(event.sender);\n        if (!skipLocalTracks) {\n            this.localStreams.forEach(function (stream) {\n                stream.getTracks().forEach(function (track) {\n                    var rtpSender = pc.addTrack(track, stream);\n                    if (_this.encrypted) {\n                        var streams = rtpSender.createEncodedStreams();\n                        streams.readableStream\n                            .pipeThrough(new TransformStream({\n                            transform: _this.e2ee.encode.bind(_this.e2ee),\n                        }))\n                            .pipeTo(streams.writableStream);\n                    }\n                });\n            });\n        }\n        pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(event.message)));\n        pc.createAnswer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then(function (description) {\n            pc.setLocalDescription(description).then(function () {\n                if (_this.bandwidthConstraints)\n                    description.sdp = _this.setMediaBitrates(description.sdp);\n                var answer = {\n                    sender: _this.localPeerId,\n                    recipient: event.sender,\n                    message: JSON.stringify(description)\n                };\n                _this.brokerController.invoke(\"contextSignal\", answer);\n            }).catch(function (err) { return _this.addError(err); });\n        }).catch(function (err) { return _this.addError(err); });\n    };\n    WebRTC.prototype.addLocalStream = function (stream) {\n        this.localStreams.push(stream);\n        return this;\n    };\n    WebRTC.prototype.addIceServer = function (iceServer) {\n        this.rtcConfig.iceServers.push(iceServer);\n        return this;\n    };\n    WebRTC.prototype.removePeerConnection = function (id) {\n        this.peers.delete(id);\n    };\n    WebRTC.prototype.createPeerConnection = function (id) {\n        var _this = this;\n        var config;\n        if (this.encrypted) {\n            config = this.rtcConfig;\n            config.encodedInsertableStreams = true;\n            config.forceEncodedVideoInsertableStreams = true;\n            config.forceEncodedAudioInsertableStreams = true;\n        }\n        else {\n            config = this.rtcConfig;\n        }\n        var rtcPeerConnection = new RTCPeerConnection(config);\n        rtcPeerConnection.onsignalingstatechange = function (state) { };\n        rtcPeerConnection.onicecandidate = function (event) {\n            if (!event || !event.candidate)\n                return;\n            if (event.candidate) {\n                var msg = {\n                    sender: _this.localPeerId,\n                    recipient: id,\n                    message: JSON.stringify({\n                        type: 'candidate',\n                        iceCandidate: event.candidate\n                    })\n                };\n                _this.brokerController.invoke(\"contextSignal\", msg);\n            }\n        };\n        rtcPeerConnection.oniceconnectionstatechange = function (event) {\n            switch (event.target.iceConnectionState) {\n                case \"connected\":\n                    _this.onConnected(id);\n                    break;\n                case \"disconnected\":\n                    _this.cleanUp(id);\n                    _this.onDisconnected(id);\n                    break;\n            }\n        };\n        rtcPeerConnection.ontrack = function (event) {\n            var connection = _this.peers.get(id);\n            connection.Stream.addTrack(event.track);\n            if (_this.onRemoteTrack)\n                _this.onRemoteTrack(event.track, connection, event);\n        };\n        this.dataChannels.forEach(function (dataChannel) {\n            var pc = new PeerChannel_1.PeerChannel(id, rtcPeerConnection.createDataChannel(dataChannel.label), dataChannel.label);\n            dataChannel.addPeerChannel(pc);\n            rtcPeerConnection.ondatachannel = function (event) {\n                var channel = event.channel;\n                channel.onopen = function (event) {\n                    _this.dataChannels.get(channel.label).onOpen(event, id, channel.label);\n                };\n                channel.onclose = function (event) {\n                    _this.dataChannels.get(channel.label).removePeerChannel(id);\n                    _this.dataChannels.get(channel.label).onClose(event, id, channel.label);\n                };\n                channel.onmessage = function (message) {\n                    _this.dataChannels.get(channel.label).onMessage(message);\n                };\n            };\n        });\n        return rtcPeerConnection;\n    };\n    WebRTC.prototype.cleanUp = function (id) {\n        this.dataChannels.forEach(function (d) {\n            d.removePeerChannel(id);\n        });\n    };\n    WebRTC.prototype.findPeerConnection = function (id) {\n        return this.peers.get(id);\n    };\n    WebRTC.prototype.reconnectAll = function () {\n        throw \"not yet implemeted\";\n    };\n    WebRTC.prototype.getPeerConnection = function (id) {\n        var match = this.peers.get(id);\n        if (!match) {\n            var pc = new WebRTCConnection_1.WebRTCConnection(id, this.createPeerConnection(id));\n            this.peers.set(id, pc);\n            return pc.RTCPeer;\n        }\n        return match.RTCPeer;\n    };\n    WebRTC.prototype.createOffer = function (peer) {\n        var _this = this;\n        var peerConnection = this.createPeerConnection(peer.peerId);\n        this.localStreams.forEach(function (stream) {\n            stream.getTracks().forEach(function (track) {\n                var rtpSender = peerConnection.addTrack(track, stream);\n                if (_this.encrypted) {\n                    var senderStreams = rtpSender.createEncodedStreams();\n                    console.log(\"createOffer -> senderStreams\", senderStreams);\n                    senderStreams.readableStream\n                        .pipeThrough(new TransformStream({\n                        transform: _this.e2ee.encode.bind(_this.e2ee),\n                    }))\n                        .pipeTo(senderStreams.writableStream);\n                }\n            });\n            if (_this.onLocalStream)\n                _this.onLocalStream(stream);\n        });\n        peerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then(function (description) {\n            peerConnection.setLocalDescription(description).then(function () {\n                if (_this.bandwidthConstraints)\n                    description.sdp = _this.setMediaBitrates(description.sdp);\n                var offer = {\n                    sender: _this.localPeerId,\n                    recipient: peer.peerId,\n                    message: JSON.stringify(description)\n                };\n                _this.brokerController.invoke(\"contextSignal\", offer);\n            }).catch(function (err) {\n                _this.addError(err);\n            });\n        }).catch(function (err) {\n            _this.addError(err);\n        });\n        return peerConnection;\n    };\n    WebRTC.prototype.disconnect = function () {\n        this.peers.forEach(function (connection) {\n            connection.RTCPeer.close();\n        });\n        this.changeContext(Math.random().toString(36).substring(2));\n    };\n    WebRTC.prototype.disconnectPeer = function (id) {\n        var peer = this.findPeerConnection(id);\n        peer.RTCPeer.close();\n    };\n    WebRTC.prototype.connect = function (peerConnections) {\n        var _this = this;\n        peerConnections.forEach(function (peerConnection) {\n            var pc = new WebRTCConnection_1.WebRTCConnection(peerConnection.peerId, _this.createOffer(peerConnection));\n            _this.peers.set(peerConnection.peerId, pc);\n        });\n        return this;\n    };\n    WebRTC.prototype.changeContext = function (context) {\n        this.brokerController.invoke(\"changeContext\", { context: context });\n        return this;\n    };\n    WebRTC.prototype.connectPeers = function () {\n        this.brokerController.invoke(\"connectContext\", {});\n    };\n    WebRTC.prototype.connectContext = function () {\n        this.connectPeers();\n    };\n    return WebRTC;\n}());\nexports.WebRTC = WebRTC;\n\n\n//# sourceURL=webpack:///./src/WebRTC/WebRTC.js?");

/***/ }),

/***/ "./src/WebRTC/WebRTCConnection.js":
/*!****************************************!*\
  !*** ./src/WebRTC/WebRTCConnection.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar WebRTCConnection = (function () {\n    function WebRTCConnection(id, rtcPeerConnection) {\n        this.id = id;\n        this.RTCPeer = rtcPeerConnection;\n        this.Stream = new MediaStream();\n    }\n    return WebRTCConnection;\n}());\nexports.WebRTCConnection = WebRTCConnection;\n\n\n//# sourceURL=webpack:///./src/WebRTC/WebRTCConnection.js?");

/***/ }),

/***/ "./test/main.js":
/*!**********************!*\
  !*** ./test/main.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar __1 = __webpack_require__(/*! .. */ \"./index.js\");\nvar Main = (function () {\n    function Main() {\n        var key = __1.Utils.newRandomString(5);\n        var factory = new __1.Factory(\"wss://dev-wss.kollokvium.net/\", [\"broker\"]);\n        factory.onOpen = function (broker) {\n            broker.onOpen = function () {\n                document.querySelector(\"input\").value = key;\n                document.querySelector(\"button\").addEventListener(\"click\", function () {\n                    rtc.e2ee.setKey(document.querySelector(\"input\").value);\n                });\n                var rtc = new __1.WebRTC(broker, {\n                    \"sdpSemantics\": \"plan-b\",\n                    \"iceTransports\": \"all\",\n                    \"rtcpMuxPolicy\": \"require\",\n                    \"bundlePolicy\": \"max-bundle\",\n                    \"iceServers\": [\n                        {\n                            \"urls\": \"stun:stun.l.google.com:19302\"\n                        }\n                    ]\n                }, true, key);\n                rtc.onContextConnected = function (w, r) {\n                    console.log(\"connected to \", w.id);\n                };\n                rtc.onContextCreated = function () {\n                };\n                rtc.onContextChanged = function (data) {\n                    console.log(\"now connected to \" + data.context);\n                    document.querySelector(\"h1\").textContent = data.context;\n                    rtc.connectContext();\n                };\n                rtc.onRemoteTrack = function (track, connection, r) {\n                    console.log(\"Got a remote stream\", connection, track, r);\n                    var streams = r.receiver.createEncodedStreams();\n                    streams.readableStream\n                        .pipeThrough(new TransformStream({\n                        transform: rtc.e2ee.decode.bind(rtc.e2ee),\n                    }))\n                        .pipeTo(streams.writableStream);\n                    document.querySelector(\"video#remote\").srcObject = r.streams[0];\n                };\n                navigator.mediaDevices.getUserMedia({\n                    audio: true, video: {\n                        width: {\n                            ideal: 640\n                        }, height: { ideal: 360 }\n                    }\n                }).then(function (ms) {\n                    rtc.addLocalStream(ms);\n                    document.querySelector(\"video#local\").srcObject = ms;\n                    rtc.changeContext(location.hash.length === 0 ? \"foo\" : location.hash);\n                });\n            };\n            broker.connect();\n        };\n    }\n    return Main;\n}());\nexports.Main = Main;\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n    console.log(\"Starting\");\n    var test = new Main();\n});\n\n\n//# sourceURL=webpack:///./test/main.js?");

/***/ })

/******/ });