"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BinaryMessage_1 = require("./BinaryMessage");
var Utils_1 = require("../Utils/Utils");
var TextMessage = (function () {
    function TextMessage(topic, object, controller, buffer, uuid, isFinal) {
        this.D = object;
        this.T = topic;
        this.C = controller;
        this.B = buffer;
        this.I = uuid || Utils_1.Utils.newGuid();
        this.F = isFinal;
    }
    Object.defineProperty(TextMessage.prototype, "JSON", {
        get: function () {
            return {
                T: this.T,
                D: JSON.stringify(this.D),
                C: this.C,
                I: this.I,
                F: this.F
            };
        },
        enumerable: true,
        configurable: true
    });
    TextMessage.prototype.toString = function () {
        return JSON.stringify(this.JSON);
    };
    TextMessage.fromArrayBuffer = function (buffer) {
        return BinaryMessage_1.BinaryMessage.fromArrayBuffer(buffer);
    };
    return TextMessage;
}());
exports.TextMessage = TextMessage;
