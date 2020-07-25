export declare class Utils {
    /**
     * Coverts string to a Uint8Array
     *
     * @static
     * @param {string} str
     * @returns
     * @memberof Utils
     */
    static stingToBuffer(str: string): Uint8Array;
    /**
     * Uint8Array to long(number)
     *
     * @static
     * @param {Uint8Array} byteArray
     * @returns {number}
     * @memberof Utils
     */
    static arrayToLong(byteArray: Uint8Array): number;
    /**
     * long(number) to Uint8Array
     *
     * @static
     * @param {number} long
     * @returns {Uint8Array}
     * @memberof Utils
     */
    static longToArray(long: number): Uint8Array;
    /**
     * Create a UUID/GUID
     *
     * @static
     * @returns
     * @memberof Utils
     */
    static newGuid(): string;
    /**
     * Create a random string
     *
     * @static
     * @param {number} length
     * @returns
     * @memberof Utils
     */
    static newRandomString(length: number): string;
    /**
     * Join ArrayBuffers
     *
     * @static
     * @param {ArrayBuffer} a
     * @param {ArrayBuffer} b
     * @returns {ArrayBuffer}
     * @memberof Utils
     */
    static joinBuffers(a: ArrayBuffer, b: ArrayBuffer): ArrayBuffer;
}
