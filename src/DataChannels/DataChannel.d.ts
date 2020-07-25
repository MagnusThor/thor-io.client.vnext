import { TextMessage } from "../Messages/TextMessage";
import { DataChannelListner } from "./DataChannelListner";
import { PeerChannel } from './PeerChannel';
/**
 * Create a new DataChannel for the WebRTCPeerConnection
 *
 * @export
 * @class DataChannel
 */
export declare class DataChannel {
    Listners: Map<string, DataChannelListner>;
    label: string;
    PeerChannels: Map<{
        id: string;
        name: string;
    }, PeerChannel>;
    messageFragments: Map<string, {
        msg: TextMessage;
        receiveBuffer: ArrayBuffer;
    }>;
    constructor(label: string, listeners?: Map<string, DataChannelListner>);
    private findListener;
    /**
     * Add a listener for specific topic
     *
     * @param {string} topic
     * @param {*} fn
     * @returns {DataChannelListner}
     * @memberof DataChannel
     */
    on<T>(topic: string, fn: (message: T, arrayBuffer: ArrayBuffer) => void): DataChannelListner;
    /**
     * Remove a listener for specific topic
     *
     * @param {string} topic
     * @memberof DataChannel
     */
    off(topic: string): boolean;
    /**
     * Fires then the DataChannel is ready and open
     *
     * @param {Event} event
     * @param {string} peerId
     * @memberof DataChannel
     */
    onOpen(event: Event, peerId: string, name: string): void;
    /**
     * Fires when the DataChannel is closed or lost
     *
     * @param {Event} event
     * @param {string} peerId
     * @memberof DataChannel
     */
    onClose(event: Event, peerId: string, name: string): void;
    /**
     * Add a message fragment ( continuous messages )
     *
     * @private
     * @param {TextMessage} message
     * @memberof DataChannel
     */
    private addMessageFragment;
    private dispatchMessage;
    /**
     * Do not overide this method, unless you need it.
     *
     * @param {MessageEvent} event
     * @memberof DataChannel
     */
    onMessage(event: MessageEvent): void;
    /**
     * Close the DataChannel
     *
     * @memberof DataChannel
     */
    close(name?: string): void;
    /**
     * Send a message to peers
     *
     * @param {string} topic
     * @param {*} data
     * @returns {DataChannel}
     * @memberof DataChannel
     */
    invoke(topic: string, data: any, isFinal?: boolean, uuid?: string): DataChannel;
    invokeBinary(topic: string, data: any, arrayBuffer: ArrayBuffer, isFinal: boolean, uuid?: string): DataChannel;
    /**
     *  Add a PeerChannel
     *
     * @param {PeerChannel} pc
     * @memberof DataChannel
     */
    addPeerChannel(pc: PeerChannel): void;
    /**
     *  Remove a PeerChannel
     *
     * @param {*} id
     * @returns {boolean}
     * @memberof DataChannel
     */
    removePeerChannel(id: any): boolean;
}
