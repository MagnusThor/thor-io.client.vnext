import { BinaryMessage } from "./BinaryMessage";
export class TextMessage {
    B: ArrayBuffer | Uint8Array;
    T: string;
    D: any;
    C: string;
    get JSON(): any {
        return {
            T: this.T,
            D: JSON.stringify(this.D),
            C: this.C
        };
    }
    constructor(topic: string, object: any, controller: string, buffer?: ArrayBuffer | Uint8Array) {
        this.D = object;
        this.T = topic;
        this.C = controller;
        this.B = buffer;
    }
    toString() {
        return JSON.stringify(this.JSON);
    }
    static fromArrayBuffer(buffer: ArrayBuffer): TextMessage {
        return BinaryMessage.fromArrayBuffer(buffer);
    }
}
