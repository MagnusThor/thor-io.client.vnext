"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    static stingToBuffer(str) {
        let len = str.length;
        var arr = new Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = str.charCodeAt(i) & 0xFF;
        }
        return new Uint8Array(arr);
    }
    static arrayToLong(byteArray) {
        var value = 0;
        let byteLength = byteArray.byteLength;
        for (let i = byteLength - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }
        return value;
    }
    static longToArray(long) {
        var byteArray = new Uint8Array(8);
        let byteLength = byteArray.length;
        for (let index = 0; index < byteLength; index++) {
            let byte = long & 0xff;
            byteArray[index] = byte;
            long = (long - byte) / 256;
        }
        return byteArray;
    }
    static newGuid() {
        const s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }
    static newRandomString(length) {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
    }
    static joinBuffers(a, b) {
        let newBuffer = new Uint8Array(a.byteLength + b.byteLength);
        newBuffer.set(new Uint8Array(a), 0);
        newBuffer.set(new Uint8Array(b), a.byteLength);
        return newBuffer.buffer;
    }
}
exports.Utils = Utils;
