/**
 * Listener object for thor-io.vnext message event 
 *
 * @export
 * @class Listener
 */
export class Listener {
    fn: Function;
    topic: string;
    count: number;
    constructor(topic: string, fn: Function) {
        this.fn = fn;
        this.topic = topic;
        this.count = 0;
    }
}
