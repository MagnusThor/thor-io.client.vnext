"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = (function () {
    function Utils() {
    }
    Utils.stingToBuffer = function (str) {
        var len = str.length;
        var arr = new Array(len);
        for (var i = 0; i < len; i++) {
            arr[i] = str.charCodeAt(i) & 0xFF;
        }
        return new Uint8Array(arr);
    };
    Utils.arrayToLong = function (byteArray) {
        var value = 0;
        var byteLength = byteArray.byteLength;
        for (var i = byteLength - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }
        return value;
    };
    Utils.longToArray = function (long) {
        var byteArray = new Uint8Array(8);
        var byteLength = byteArray.length;
        for (var index = 0; index < byteLength; index++) {
            var byte = long & 0xff;
            byteArray[index] = byte;
            long = (long - byte) / 256;
        }
        return byteArray;
    };
    Utils.newGuid = function () {
        var s4 = function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
    };
    Utils.newRandomString = function (length) {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
    };
    Utils.joinBuffers = function (a, b) {
        var newBuffer = new Uint8Array(a.byteLength + b.byteLength);
        newBuffer.set(new Uint8Array(a), 0);
        newBuffer.set(new Uint8Array(b), a.byteLength);
        return newBuffer.buffer;
    };
    return Utils;
}());
exports.Utils = Utils;
