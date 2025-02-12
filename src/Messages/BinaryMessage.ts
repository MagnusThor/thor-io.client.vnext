import { Utils } from '../Utils/Utils';
import { TextMessage } from './TextMessage';

/**
 *  thor-io BinaryMessage
 *
 * @export
 * @class BinaryMessage
 */
export class BinaryMessage {
    buffer: ArrayBuffer;
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
        
        // Use TextDecoder to decode the bytes into a string
        let textDecoder = new TextDecoder();
        let textMessage = textDecoder.decode(bytesMessage);
        
        let message = JSON.parse(textMessage) as TextMessage;
        return new TextMessage(message.T, message.D, message.C, messageBuffer, message.I, message.F);
    }
    /**
     *Creates an instance of BinaryMessage.
     * @param {string} message
     * @param {ArrayBuffer} arrayBuffer
     * @memberof BinaryMessage
     */
    constructor(message: string, public arrayBuffer: ArrayBuffer) {
        this.header = new Uint8Array(Utils.longToArray(message.length));
        this.buffer = Utils.joinBuffers(Utils.joinBuffers(this.header.buffer, Utils.stringToBuffer(message).buffer), arrayBuffer);
    }
 
}
