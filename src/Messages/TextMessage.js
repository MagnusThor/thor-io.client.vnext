"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinaryMessage_1 = require("./BinaryMessage");
const Utils_1 = require("../Utils/Utils");
class TextMessage {
    constructor(topic, object, controller, buffer, uuid, isFinal) {
        this.D = object;
        this.T = topic;
        this.C = controller;
        this.B = buffer;
        this.I = uuid || Utils_1.Utils.newGuid();
        this.F = isFinal;
    }
    toJSON() {
        return {
            T: this.T,
            D: JSON.stringify(this.D),
            C: this.C,
            I: this.I,
            F: this.F
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
    static fromArrayBuffer(buffer) {
        return BinaryMessage_1.BinaryMessage.fromArrayBuffer(buffer);
    }
}
exports.TextMessage = TextMessage;
