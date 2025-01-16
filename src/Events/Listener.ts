/**
 * Listener object for thor-io.vnext message event 
 *
 * @export
 * @class Listener
 */
export class Listener{
    action: (data:any,buffer?:ArrayBuffer) => void;
    topic: string;
    count: number;
    constructor(topic: string, action: (data:any,buffer?:ArrayBuffer) => void) {
        this.action = action;
        this.topic = topic;
        this.count = 0;
    }
}


