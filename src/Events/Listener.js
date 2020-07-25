"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Listener {
    constructor(topic, fn) {
        this.fn = fn;
        this.topic = topic;
        this.count = 0;
    }
}
exports.Listener = Listener;
