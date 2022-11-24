"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryMessage = void 0;
const Utils_1 = require("../Utils/Utils");
const TextMessage_1 = require("./TextMessage");
class BinaryMessage {
    static fromArrayBuffer(buffer) {
        let bytes = new Uint8Array(buffer);
        let header = bytes.slice(0, 8);
        let payloadLength = Utils_1.Utils.arrayToLong(header);
        let start = header.byteLength + payloadLength;
        let bytesMessage = bytes.slice(header.byteLength, start);
        let stop = buffer.byteLength;
        let messageBuffer = bytes.slice(start, stop);
        let textMessage = String.fromCharCode.apply(null, new Uint16Array(bytesMessage));
        let message = JSON.parse(textMessage);
        return new TextMessage_1.TextMessage(message.T, message.D, message.C, messageBuffer, message.I, message.F);
    }
    constructor(message, arrayBuffer) {
        this.arrayBuffer = arrayBuffer;
        this.header = new Uint8Array(Utils_1.Utils.longToArray(message.length));
        this.buffer = Utils_1.Utils.joinBuffers(Utils_1.Utils.joinBuffers(this.header.buffer, Utils_1.Utils.stingToBuffer(message).buffer), arrayBuffer);
    }
}
exports.BinaryMessage = BinaryMessage;
