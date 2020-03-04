import { Utils } from "../Utils/Utils";
/**
 * Propery setter/getter message wrapper
 *
 * @export
 * @class PropertyMessage
 */
export class PropertyMessage {
    name: string;
    value: any;
    messageId: string;
    constructor() {
        this.messageId = Utils.newGuid();
    }
}
