"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Listener = /** @class */ (function () {
    function Listener(topic, fn) {
        this.fn = fn;
        this.topic = topic;
        this.count = 0;
    }
    return Listener;
}());
exports.Listener = Listener;
//# sourceMappingURL=Listener.js.map