import { TextMessage } from "./TextMessage";
/**
 *  thor-io BinaryMessage
 *
 * @export
 * @class BinaryMessage
 */
export declare class BinaryMessage {
    arrayBuffer: ArrayBuffer;
    buffer: ArrayBuffer;
    private header; /**
     * Convert a BinnayMessage to TextMessage ( extract embedeed TextMessage)
     *
     * @static
     * @param {ArrayBuffer} buffer
     * @returns {TextMessage}
     * @memberof BinaryMessage
     */
    static fromArrayBuffer(buffer: ArrayBuffer): TextMessage;
    /**
     *Creates an instance of BinaryMessage.
     * @param {string} message
     * @param {ArrayBuffer} arrayBuffer
     * @memberof BinaryMessage
     */
    constructor(message: string, arrayBuffer: ArrayBuffer);
}
