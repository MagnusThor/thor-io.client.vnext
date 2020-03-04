"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("../Utils/Utils");
var TextMessage_1 = require("./TextMessage");
var BinaryMessage = (function () {
    function BinaryMessage(message, arrayBuffer) {
        this.arrayBuffer = arrayBuffer;
        this.header = new Uint8Array(Utils_1.Utils.longToArray(message.length));
        this.Buffer = this.joinBuffers(this.joinBuffers(this.header.buffer, Utils_1.Utils.stingToBuffer(message).buffer), arrayBuffer);
    }
    BinaryMessage.fromArrayBuffer = function (buffer) {
        var bytes = new Uint8Array(buffer);
        var header = bytes.slice(0, 8);
        var payloadLength = Utils_1.Utils.arrayToLong(header);
        var start = header.byteLength + payloadLength;
        var bytesMessage = bytes.slice(header.byteLength, start);
        var stop = buffer.byteLength - start;
        var messageBuffer = bytes.slice(start, stop);
        var message = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(bytesMessage)));
        return new TextMessage_1.TextMessage(message.T, message.D, message.C, messageBuffer);
    };
    BinaryMessage.prototype.joinBuffers = function (a, b) {
        var newBuffer = new Uint8Array(a.byteLength + b.byteLength);
        newBuffer.set(new Uint8Array(a), 0);
        newBuffer.set(new Uint8Array(b), a.byteLength);
        return newBuffer.buffer;
    };
    return BinaryMessage;
}());
exports.BinaryMessage = BinaryMessage;
