"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextMessage = void 0;
const Utils_1 = require("../Utils/Utils");
const BinaryMessage_1 = require("./BinaryMessage");
class TextMessage {
    toJSON() {
        return {
            T: this.T,
            D: JSON.stringify(this.D),
            C: this.C,
            I: this.I,
            F: this.F,
        };
    }
    constructor(topic, object, controller, buffer, uuid, isFinal) {
        this.D = object;
        this.T = topic;
        this.C = controller;
        this.B = buffer;
        this.I = uuid || Utils_1.Utils.newGuid();
        this.F = isFinal;
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    static fromArrayBuffer(buffer) {
        return BinaryMessage_1.BinaryMessage.fromArrayBuffer(buffer);
    }
}
exports.TextMessage = TextMessage;
