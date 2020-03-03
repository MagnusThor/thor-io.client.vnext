export class Utils {
    static stingToBuffer(str: string) {
        let len = str.length;
        var arr = new Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = str.charCodeAt(i) & 0xFF;
        }
        return new Uint8Array(arr);
    }
    static arrayToLong(byteArray: Uint8Array): number {
        var value = 0;
        let byteLength = byteArray.byteLength;
        for (let i = byteLength - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }
        return value;
    }
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
    static newGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        ;
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    }
}
