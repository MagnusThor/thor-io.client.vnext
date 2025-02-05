"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
class Listener {
    constructor(topic, action) {
        this.action = action;
        this.topic = topic;
        this.count = 0;
    }
}
exports.Listener = Listener;
