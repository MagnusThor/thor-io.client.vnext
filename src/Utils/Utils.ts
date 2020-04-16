export class Utils {
    /**
     * Coverts string to a Uint8Array
     *
     * @static
     * @param {string} str
     * @returns
     * @memberof Utils
     */
    static stingToBuffer(str: string) {
        let len = str.length;
        var arr = new Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = str.charCodeAt(i) & 0xFF;
        }
        return new Uint8Array(arr);
    }
    /**
     * Uint8Array to long(number)
     *
     * @static
     * @param {Uint8Array} byteArray
     * @returns {number}
     * @memberof Utils
     */
    static arrayToLong(byteArray: Uint8Array): number {
        var value = 0;
        let byteLength = byteArray.byteLength;
        for (let i = byteLength - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }
        return value;
    }
    /**
     * long(number) to Uint8Array
     *
     * @static
     * @param {number} long
     * @returns {Uint8Array}
     * @memberof Utils
     */
    static longToArray(long: number): Uint8Array {
        var byteArray = new Uint8Array(8);
        let byteLength = byteArray.length;
        for (let index = 0; index < byteLength; index++) {
            let byte = long & 0xff;
            byteArray[index] = byte;
            long = (long - byte) / 256;
        }
        return byteArray;
    }
    /**
     * Create a UUID/GUID
     *
     * @static
     * @returns
     * @memberof Utils
     */
    static newGuid() {
        const s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }
    /**
     * Create a random string
     *
     * @static
     * @param {number} length
     * @returns
     * @memberof Utils
     */
    static newRandomString(length:number){
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
    }

    /**
     * Join ArrayBuffers
     *
     * @static
     * @param {ArrayBuffer} a
     * @param {ArrayBuffer} b
     * @returns {ArrayBuffer}
     * @memberof Utils
     */
    static joinBuffers(a: ArrayBuffer, b: ArrayBuffer): ArrayBuffer {
        let newBuffer = new Uint8Array(a.byteLength + b.byteLength);
        newBuffer.set(new Uint8Array(a), 0);
        newBuffer.set(new Uint8Array(b), a.byteLength);
        return newBuffer.buffer;
    }
}
