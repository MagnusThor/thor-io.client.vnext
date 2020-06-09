"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var E2EEBase = (function () {
    function E2EEBase(currentCryptoKey) {
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
    E2EEBase.prototype.setKey = function (key) {
        this.currentCryptoKey = key;
    };
    E2EEBase.prototype.dump = function (encodedFrame, direction, max) {
        if (max === void 0) { max = 16; }
        var data = new Uint8Array(encodedFrame.data);
        var bytes = '';
        for (var j = 0; j < data.length && j < max; j++) {
            bytes += (data[j] < 16 ? '0' : '') + data[j].toString(16) + ' ';
        }
        console.log(performance.now().toFixed(2), direction, bytes.trim(), 'len=' + encodedFrame.data.byteLength, 'type=' + (encodedFrame.type || 'audio'), 'ts=' + encodedFrame.timestamp, 'ssrc=' + encodedFrame.synchronizationSource);
    };
    E2EEBase.prototype.encode = function (encodedFrame, controller) {
        if (this.scount++ < 30) {
            this.dump(encodedFrame, 'send');
        }
        if (this.currentCryptoKey) {
            var view = new DataView(encodedFrame.data);
            var newData = new ArrayBuffer(encodedFrame.data.byteLength + 5);
            var newView = new DataView(newData);
            var cryptoOffset = this.useCryptoOffset ? this.frameTypeToCryptoOffset[encodedFrame.type] : 0;
            for (var i = 0; i < cryptoOffset && i < encodedFrame.data.byteLength; ++i) {
                newView.setInt8(i, view.getInt8(i));
            }
            for (var i = cryptoOffset; i < encodedFrame.data.byteLength; ++i) {
                var keyByte = this.currentCryptoKey.charCodeAt(i % this.currentCryptoKey.length);
                newView.setInt8(i, view.getInt8(i) ^ keyByte);
            }
            newView.setUint8(encodedFrame.data.byteLength, this.currentKeyIdentifier % 0xff);
            newView.setUint32(encodedFrame.data.byteLength + 1, 0xDEADBEEF);
            encodedFrame.data = newData;
        }
        controller.enqueue(encodedFrame);
    };
    E2EEBase.prototype.decode = function (encodedFrame, controller) {
        if (this.rcount++ < 30) {
            this.dump(encodedFrame, 'recv');
        }
        var view = new DataView(encodedFrame.data);
        var checksum = encodedFrame.data.byteLength > 4 ? view.getUint32(encodedFrame.data.byteLength - 4) : false;
        if (this.currentCryptoKey) {
            if (checksum !== 0xDEADBEEF) {
                console.log('Corrupted frame received, checksum ' +
                    checksum.toString(16));
                return;
            }
            var keyIdentifier = view.getUint8(encodedFrame.data.byteLength - 5);
            if (keyIdentifier !== this.currentKeyIdentifier) {
                console.log("Key identifier mismatch, got " + keyIdentifier + " expected " + this.currentKeyIdentifier + ".");
                return;
            }
            var newData = new ArrayBuffer(encodedFrame.data.byteLength - 5);
            var newView = new DataView(newData);
            var cryptoOffset = this.useCryptoOffset ? this.frameTypeToCryptoOffset[encodedFrame.type] : 0;
            for (var i = 0; i < cryptoOffset; ++i) {
                newView.setInt8(i, view.getInt8(i));
            }
            for (var i = cryptoOffset; i < encodedFrame.data.byteLength - 5; ++i) {
                var keyByte = this.currentCryptoKey.charCodeAt(i % this.currentCryptoKey.length);
                newView.setInt8(i, view.getInt8(i) ^ keyByte);
            }
            encodedFrame.data = newData;
        }
        else if (checksum === 0xDEADBEEF) {
            return;
        }
        controller.enqueue(encodedFrame);
    };
    return E2EEBase;
}());
exports.E2EEBase = E2EEBase;
