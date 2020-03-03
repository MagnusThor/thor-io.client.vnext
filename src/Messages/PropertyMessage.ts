import { Utils } from "../Utils/Utils";
export class PropertyMessage {
    name: string;
    value: any;
    messageId: string;
    constructor() {
        this.messageId = Utils.newGuid();
    }
}
