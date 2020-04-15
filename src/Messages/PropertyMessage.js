"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils/Utils");
class PropertyMessage {
    constructor() {
        this.messageId = Utils_1.Utils.newGuid();
    }
}
exports.PropertyMessage = PropertyMessage;
