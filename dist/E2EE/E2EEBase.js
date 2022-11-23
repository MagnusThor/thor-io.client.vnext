"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.E2EEBase = void 0;
class E2EEBase {
    setKey(key) {
        this.currentCryptoKey = key;
    }
    constructor(currentCryptoKey) {
        this.currentCryptoKey = currentCryptoKey;
        this.frameTypeToCryptoOffset = {
            key: 10,
            delta: 3,
            undefined: 1,
        };
        this.useCryptoOffset = true;
        this.currentKeyIdentifier = 0;
        this.rcount = 0;
        this.scount = 0;
    }
    dump(encodedFrame, direction, max = 16) {
        const data = new Uint8Array(encodedFrame.data);
        let bytes = '';
        for (let j = 0; j < data.length && j < max; j++) {
            bytes += (data[j] < 16 ? '0' : '') + data[j].toString(16) + ' ';
        }
        console.log(performance.now().toFixed(2), direction, bytes.trim(), 'len=' + encodedFrame.data.byteLength, 'type=' + (encodedFrame.type || 'audio'), 'ts=' + encodedFrame.timestamp, 'ssrc=' + encodedFrame.synchronizationSource);
    }
    encode(encodedFrame, controller) {
        if (this.scount++ < 30) {
            this.dump(encodedFrame, 'send');
        }
        if (this.currentCryptoKey) {
            const view = new DataView(encodedFrame.data);
            const newData = new ArrayBuffer(encodedFrame.data.byteLength + 5);
            const newView = new DataView(newData);
            const cryptoOffset = this.useCryptoOffset ? this.frameTypeToCryptoOffset[encodedFrame.type] : 0;
            for (let i = 0; i < cryptoOffset && i < encodedFrame.data.byteLength; ++i) {
                newView.setInt8(i, view.getInt8(i));
            }
            for (let i = cryptoOffset; i < encodedFrame.data.byteLength; ++i) {
                const keyByte = this.currentCryptoKey.charCodeAt(i % this.currentCryptoKey.length);
                newView.setInt8(i, view.getInt8(i) ^ keyByte);
            }
            newView.setUint8(encodedFrame.data.byteLength, this.currentKeyIdentifier % 0xff);
            newView.setUint32(encodedFrame.data.byteLength + 1, 0xDEADBEEF);
            encodedFrame.data = newData;
        }
        controller.enqueue(encodedFrame);
    }
    decode(encodedFrame, controller) {
        if (this.rcount++ < 30) {
            this.dump(encodedFrame, 'recv');
        }
        const view = new DataView(encodedFrame.data);
        const checksum = encodedFrame.data.byteLength > 4 ? view.getUint32(encodedFrame.data.byteLength - 4) : false;
        if (this.currentCryptoKey) {
            if (checksum !== 0xDEADBEEF) {
                console.log('Corrupted frame received, checksum ' +
                    checksum.toString(16));
                return;
            }
            const keyIdentifier = view.getUint8(encodedFrame.data.byteLength - 5);
            if (keyIdentifier !== this.currentKeyIdentifier) {
                console.log(`Key identifier mismatch, got ${keyIdentifier} expected ${this.currentKeyIdentifier}.`);
                return;
            }
            const newData = new ArrayBuffer(encodedFrame.data.byteLength - 5);
            const newView = new DataView(newData);
            const cryptoOffset = this.useCryptoOffset ? this.frameTypeToCryptoOffset[encodedFrame.type] : 0;
            for (let i = 0; i < cryptoOffset; ++i) {
                newView.setInt8(i, view.getInt8(i));
            }
            for (let i = cryptoOffset; i < encodedFrame.data.byteLength - 5; ++i) {
                const keyByte = this.currentCryptoKey.charCodeAt(i % this.currentCryptoKey.length);
                newView.setInt8(i, view.getInt8(i) ^ keyByte);
            }
            encodedFrame.data = newData;
        }
        else if (checksum === 0xDEADBEEF) {
            return;
        }
        controller.enqueue(encodedFrame);
    }
}
exports.E2EEBase = E2EEBase;
