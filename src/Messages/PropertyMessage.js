"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyMessage = void 0;
const Utils_1 = require("../Utils/Utils");
class PropertyMessage {
    constructor() {
        this.messageId = Utils_1.Utils.newGuid();
    }
}
exports.PropertyMessage = PropertyMessage;
