/**
 * Utility class for common operations.
 */
export class Utils {
    /**
     * Converts a string to a Uint8Array.
     *
     * @param {string} str - The input string.
     * @returns {Uint8Array} - The Uint8Array representation of the string.
     */
    static stringToBuffer(str: string): Uint8Array {
      const len = str.length;
      const arr = new Array(len);
      for (let i = 0; i < len; i++) {
        arr[i] = str.charCodeAt(i) & 0xFF;
      }
      return new Uint8Array(arr);
    }
  
    /**
     * Converts a Uint8Array to a long (number).
     *
     * @param {Uint8Array} byteArray - The input Uint8Array.
     * @returns {number} - The long value represented by the Uint8Array.
     */
    static arrayToLong(byteArray: Uint8Array): number {
      let value = 0;
      const byteLength = byteArray.byteLength;
      for (let i = byteLength - 1; i >= 0; i--) {
        value = (value * 256) + byteArray[i];
      }
      return value;
    }
  
    /**
     * Converts a long (number) to a Uint8Array.
     *
     * @param {number} long - The input long value.
     * @returns {Uint8Array} - The Uint8Array representation of the long value.
     */
    static longToArray(long: number): Uint8Array {
      const byteArray = new Uint8Array(8); // Assuming 8 bytes for long
      const byteLength = byteArray.length;
      for (let index = 0; index < byteLength; index++) {
        const byte = long & 0xff;
        byteArray[index] = byte;
        long = (long - byte) / 256;
      }
      return byteArray;
    }
  
    /**
     * Creates a UUID/GUID.
     *
     * @returns {string} - The generated UUID.
     */
    static newGuid(): string {
      const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      };
      return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }
  
    /**
     * Creates a random string.
     *
     * @param {number} length - The desired length of the random string.
     * @returns {string} - The generated random string.
     */
    static newRandomString(length: number): string {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
    }
  
    /**
     * Joins two ArrayBuffers into a single ArrayBuffer.
     *
     * @param {ArrayBuffer} a - The first ArrayBuffer.
     * @param {ArrayBuffer} b - The second ArrayBuffer.
     * @returns {ArrayBuffer} - The combined ArrayBuffer.
     */
    static joinBuffers(a: ArrayBuffer, b: ArrayBuffer): ArrayBuffer {
      const newBuffer = new Uint8Array(a.byteLength + b.byteLength);
      newBuffer.set(new Uint8Array(a), 0);
      newBuffer.set(new Uint8Array(b), a.byteLength);
      return newBuffer.buffer;
    }
  }