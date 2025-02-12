import { TextMessage } from './TextMessage';
export declare class BinaryMessage {
    arrayBuffer: ArrayBuffer;
    buffer: ArrayBuffer;
    private header;
    static fromArrayBuffer(buffer: ArrayBuffer): TextMessage;
    constructor(message: string, arrayBuffer: ArrayBuffer);
}
