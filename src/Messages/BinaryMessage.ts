import { Utils } from '../Utils/Utils';
import { TextMessage } from "./TextMessage";
/**
 *  thor-io BinaryMessage
 *
 * @export
 * @class BinaryMessage
 */
export class BinaryMessage {
    Buffer: ArrayBuffer;
    private header: Uint8Array;    /**
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
        let stop = buffer.byteLength;
        let messageBuffer = bytes.slice(start, stop);
        let textMessage = String.fromCharCode.apply(null, new Uint16Array(bytesMessage));
        let message = JSON.parse(textMessage) as TextMessage;
        return new TextMessage(message.T, message.D, message.C, messageBuffer,message.I,message.F);
    }
    /**
     *Creates an instance of BinaryMessage.
     * @param {string} message
     * @param {ArrayBuffer} arrayBuffer
     * @memberof BinaryMessage
     */
    constructor(message: string, public arrayBuffer: ArrayBuffer) {
        this.header = new Uint8Array(Utils.longToArray(message.length));
        this.Buffer = Utils.joinBuffers(Utils.joinBuffers(this.header.buffer, Utils.stingToBuffer(message).buffer), arrayBuffer);
    }
 
}
