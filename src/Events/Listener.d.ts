/**
 * Listener object for thor-io.vnext message event
 *
 * @export
 * @class Listener
 */
export declare class Listener {
    fn: Function;
    topic: string;
    count: number;
    constructor(topic: string, fn: Function);
}
