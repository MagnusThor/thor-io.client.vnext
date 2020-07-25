import { BinaryMessage } from "./BinaryMessage";
import { Utils } from '../Utils/Utils';
/**
 * thor-io TextMessage 
 *
 * @export
 * @class TextMessage
 */
export class TextMessage {
    B: ArrayBuffer | Uint8Array;
    T: string;
    D: any;
    C: string;
    I: string;
    F: boolean;
    toJSON(): any {
        return {
            T: this.T,
            D: JSON.stringify(this.D),
            C: this.C,
            I: this.I,
            F: this.F
        };
    }
    constructor(topic: string, object: any, controller: string, buffer?: ArrayBuffer | Uint8Array, uuid?: string, isFinal?: boolean) {
        this.D = object;
        this.T = topic;
        this.C = controller;
        this.B = buffer;
        this.I = uuid || Utils.newGuid()
        this.F = isFinal;
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    static fromArrayBuffer(buffer: ArrayBuffer): TextMessage {
        return BinaryMessage.fromArrayBuffer(buffer);
    }
}
