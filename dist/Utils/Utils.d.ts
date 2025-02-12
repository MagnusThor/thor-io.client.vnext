export declare class Utils {
    static stringToBuffer(str: string): Uint8Array;
    static arrayToLong(byteArray: Uint8Array): number;
    static longToArray(long: number): Uint8Array;
    static newGuid(): string;
    static newRandomString(length: number): string;
    static joinBuffers(a: ArrayBuffer, b: ArrayBuffer): ArrayBuffer;
}
