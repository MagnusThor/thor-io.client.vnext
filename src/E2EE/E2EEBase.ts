export interface IE2EE {
    decode(frame: any, controller: any): any;
    encode(frame: any, controller: any): any;
    setKey(key: string): void;
}

/**
 * Primitive encryption based on https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/endtoend-encryption/js/main.js
 * @export
 * @class E2EEBase
 * @implements {IE2EE}
 */
export class E2EEBase implements IE2EE {

    private frameTypeToCryptoOffset: any = {
        key: 10,
        delta: 3,
        undefined: 1,
    };

    /** @type {boolean} */
    public useCryptoOffset: boolean = true;

    /** @type {number} */
    public currentKeyIdentifier: number = 0;

    /** @type {number} */
    public rcount: number = 0;

    /** @type {number} */
    public scount: number = 0;

    /** @type {string} */
    private currentCryptoKey: string;

    /**
     * Creates an instance of E2EEBase.
     * @param {string} currentCryptoKey The initial crypto key.
     * @memberof E2EEBase
     */
    constructor(currentCryptoKey: string) {
        this.currentCryptoKey = currentCryptoKey;
    }

    /**
     * Sets the current crypto key.
     * @param {string} key The new crypto key.
     * @memberof E2EEBase
     */
    setKey(key: string): void {
        this.currentCryptoKey = key;
    }

    /**
     * Dumps the encoded frame data for debugging.
     * @param {any} encodedFrame The encoded frame.
     * @param {any} direction The direction of the frame (send/recv).
     * @param {number} [max=16] The maximum number of bytes to dump.
     * @memberof E2EEBase
     */
    dump(encodedFrame: any, direction: any, max: number = 16): void {
        const data = new Uint8Array(encodedFrame.data);
        let bytes = '';
        for (let j = 0; j < data.length && j < max; j++) {
            bytes += (data[j] < 16 ? '0' : '') + data[j].toString(16) + ' ';
        }
        console.log(performance.now().toFixed(2), direction, bytes.trim(),
            'len=' + encodedFrame.data.byteLength,
            'type=' + (encodedFrame.type || 'audio'),
            'ts=' + encodedFrame.timestamp,
            'ssrc=' + encodedFrame.synchronizationSource
        );
    }

    /**
     * Encodes the frame with the current crypto key.
     * @param {any} encodedFrame The encoded frame.
     * @param {any} controller The controller to enqueue the frame.
     * @memberof E2EEBase
     */
    encode(encodedFrame: any, controller: any): void {
        if (this.scount++ < 30) { // dump the first 30 packets.
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

    /**
     * Decodes the frame with the current crypto key.
     * @param {any} encodedFrame The encoded frame.
     * @param {any} controller The controller to enqueue the frame.
     * @memberof E2EEBase
     */
    decode(encodedFrame: any, controller: any): void {
        if (this.rcount++ < 30) { // dump the first 30 packets
            this.dump(encodedFrame, 'recv');
        }
        const view = new DataView(encodedFrame.data);
        const checksum = encodedFrame.data.byteLength > 4 ? view.getUint32(encodedFrame.data.byteLength - 4) : false;
        if (this.currentCryptoKey) {
            if (checksum !== 0xDEADBEEF) {
                console.log('Corrupted frame received, checksum ' +
                    checksum.toString(16));
                return; // This can happen when the key is set and there is an unencrypted frame in-flight.
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
        } else if (checksum === 0xDEADBEEF) {
            return; // encrypted in-flight frame but we already forgot about the key.
        }
        controller.enqueue(encodedFrame);
    }
}
