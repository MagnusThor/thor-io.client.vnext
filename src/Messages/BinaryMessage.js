"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("../Utils/Utils");
var TextMessage_1 = require("./TextMessage");
var BinaryMessage = (function () {
    function BinaryMessage(message, arrayBuffer) {
        this.arrayBuffer = arrayBuffer;
        this.header = new Uint8Array(Utils_1.Utils.longToArray(message.length));
        this.Buffer = Utils_1.Utils.joinBuffers(Utils_1.Utils.joinBuffers(this.header.buffer, Utils_1.Utils.stingToBuffer(message).buffer), arrayBuffer);
    }
    BinaryMessage.fromArrayBuffer = function (buffer) {
        var bytes = new Uint8Array(buffer);
        var header = bytes.slice(0, 8);
        var payloadLength = Utils_1.Utils.arrayToLong(header);
        var start = header.byteLength + payloadLength;
        var bytesMessage = bytes.slice(header.byteLength, start);
        var stop = buffer.byteLength;
        var messageBuffer = bytes.slice(start, stop);
        var textMessage = String.fromCharCode.apply(null, new Uint16Array(bytesMessage));
        var message = JSON.parse(textMessage);
        return new TextMessage_1.TextMessage(message.T, message.D, message.C, messageBuffer, message.I, message.F);
    };
    return BinaryMessage;
}());
exports.BinaryMessage = BinaryMessage;
