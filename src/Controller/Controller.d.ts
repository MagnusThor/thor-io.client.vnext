import { Listener } from '../Events/Listener';
/**
 * Create a client controller(proxy) for a thor-io.vnext controller
 *
 * @export
 * @class Controller
 */
export declare class Controller {
    alias: string;
    private ws;
    isConnected: boolean;
    private listeners;
    constructor(alias: string, ws: WebSocket);
    /**
     * Fires when an error occurs
     *
     * @param {*} event
     * @memberof Controller
     */
    onError(event: any): void;
    /**
     * Fires when sucessfully created a connection to the thor-io.vnext sever controller
     *
     * @param {*} event
     * @memberof Controller
     */
    onOpen(event: any): void;
    /**
     *Fires when the controller's connection closed.
     *
     * @param {*} event
     * @memberof Controller
     */
    onClose(event: any): void;
    /**
     * Connect the controller (create an new instance of the thor-io.vnext server controller)
     *
     * @returns
     * @memberof Controller
     */
    connect(): this;
    /**
      *Close the connction
     *
     * @returns
     * @memberof Controller
     */
    close(): this;
    /**
     * Create a subscription
     *
     * @param {string} topic
     * @param {*} callback
     * @returns {Listener}
     * @memberof Controller
     */
    subscribe(topic: string, callback: any): Listener;
    /**
     * Remove a subscription
     *
     * @param {string} topic
     * @memberof Controller
     */
    unsubscribe(topic: string): void;
    /**
     * Create a listner for RPC calls
     *
     * @param {string} topic
     * @param {*} fn
     * @returns {Listener}
     * @memberof Controller
     */
    on(topic: string, fn: any): Listener;
    /**
    * Delete a listener for RPC calls
    *
    * @param {string} topic
    * @memberof Controller
    */
    of(topic: string): void;
    private findListener;
    /**
     * Send an ArrayBuffer
     *
     * @param {ArrayBuffer} buffer
     * @returns {Controller}
     * @memberof Controller
     */
    invokeBinary(buffer: ArrayBuffer): Controller;
    /**
     * Publish a BinaryMessage on the specific topic
     *
     * @param {ArrayBuffer} buffer
     * @returns {Controller}
     * @memberof Controller
     */
    publishBinary(buffer: ArrayBuffer): Controller;
    /**
     * Call a method (rpc) on the controller
     *
     * @param {string} method
     * @param {*} data
     * @param {string} [controller]
     * @returns {Controller}
     * @memberof Controller
     */
    invoke(method: string, data: any, controller?: string): Controller;
    /**
     * Publish a message on the specific topic
     *
     * @param {string} topic
     * @param {*} data
     * @param {string} [controller]
     * @returns {Controller}
     * @memberof Controller
     */
    publish(topic: string, data: any, controller?: string): Controller;
    /**
     * Set a propety value on the controller
     *
     * @param {string} propName
     * @param {*} propValue
     * @param {string} [controller]
     * @returns {Controller}
     * @memberof Controller
     */
    setProperty(propName: string, propValue: any, controller?: string): Controller;
    /**
     * Dispatch an event (message) to the listeners
     *
     * @param {string} topic
     * @param {*} data
     * @param {(ArrayBuffer | Uint8Array)} [buffer]
     * @returns
     * @memberof Controller
     */
    dispatch(topic: string, data: any, buffer?: ArrayBuffer | Uint8Array): void;
}
