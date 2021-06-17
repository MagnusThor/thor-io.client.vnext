"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
class Listener {
    constructor(topic, fn) {
        this.fn = fn;
        this.topic = topic;
        this.count = 0;
    }
}
exports.Listener = Listener;
