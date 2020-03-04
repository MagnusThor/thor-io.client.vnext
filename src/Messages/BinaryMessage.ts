import { Utils } from "../Utils/Utils";
import { TextMessage } from "./TextMessage";
/**
 *  thor-io BinartMessage (json) 
 *
 * @export
 * @class BinaryMessage
 */
export class BinaryMessage {
    Buffer: ArrayBuffer;
    private header: Uint8Array;
    /**
     * Convert a BinnayMessage to TextMessage ( extract embedeed TextMessage)
     *
     * @static
     * @param {ArrayBuffer} buffer
     * @returns {TextMessage}
     * @memberof BinaryMessage
     */
    static fromArrayBuffer(buffer: ArrayBuffer): TextMessage {
        let bytes = new Uint8Array(buffer);
        let header = bytes.slice(0, 8);
        let payloadLength = Utils.arrayToLong(header);
        let start = header.byteLength + payloadLength;
        let bytesMessage = bytes.slice(header.byteLength, start);
        let stop = buffer.byteLength - start;
        let messageBuffer = bytes.slice(start, stop);
        let message = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(bytesMessage)));
        return new TextMessage(message.T, message.D, message.C, messageBuffer);
    }
    constructor(message: string, public arrayBuffer: ArrayBuffer) {
        this.header = new Uint8Array(Utils.longToArray(message.length));
        this.Buffer = this.joinBuffers(this.joinBuffers(this.header.buffer, Utils.stingToBuffer(message).buffer), arrayBuffer);
    }
    private joinBuffers(a: ArrayBuffer, b: ArrayBuffer): ArrayBuffer {
        let newBuffer = new Uint8Array(a.byteLength + b.byteLength);
        newBuffer.set(new Uint8Array(a), 0);
        newBuffer.set(new Uint8Array(b), a.byteLength);
        return newBuffer.buffer;
    }
}
