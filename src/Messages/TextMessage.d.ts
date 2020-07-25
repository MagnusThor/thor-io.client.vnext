/**
 * thor-io TextMessage
 *
 * @export
 * @class TextMessage
 */
export declare class TextMessage {
    B: ArrayBuffer | Uint8Array;
    T: string;
    D: any;
    C: string;
    I: string;
    F: boolean;
    toJSON(): any;
    constructor(topic: string, object: any, controller: string, buffer?: ArrayBuffer | Uint8Array, uuid?: string, isFinal?: boolean);
    toString(): string;
    static fromArrayBuffer(buffer: ArrayBuffer): TextMessage;
}
