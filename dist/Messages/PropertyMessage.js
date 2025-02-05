"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyMessage = void 0;
const Utils_1 = require("../Utils/Utils");
class PropertyMessage {
    constructor(name) {
        this.messageId = Utils_1.Utils.newGuid();
        this.name = name;
    }
}
exports.PropertyMessage = PropertyMessage;
