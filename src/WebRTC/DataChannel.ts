import { TextMessage } from "../Messages/TextMessage";
import { PeerChannel } from "./PeerChannel";
import { Listener } from "../Listener";
/**
 * Create a new DataChannel for the WebRTCPeerConnection
 *
 * @export
 * @class DataChannel
 */
export class DataChannel {
    private listeners: Array<Listener>;
    public Name: string;
    public PeerChannels: Array<PeerChannel>;
    constructor(name: string, listeners?: Array<Listener>) {
        this.listeners = listeners || new Array<Listener>();
        this.PeerChannels = new Array<PeerChannel>();
        this.Name = name;
    }
    private findListener(topic: string): Listener {
        let listener = this.listeners.find((pre: Listener) => {
            return pre.topic === topic;
        });
        return listener;
    }
    /**
     * Add a listener for specific topic
     *
     * @param {string} topic
     * @param {*} fn
     * @returns {Listener}
     * @memberof DataChannel
     */
    On(topic: string, fn: any): Listener {
        var listener = new Listener(topic, fn);
        this.listeners.push(listener);
        return listener;
    }
    /**
     * Remove a listener for specific topic  
     *
     * @param {string} topic
     * @memberof DataChannel
     */
    Off(topic: string) {
        let index = this.listeners.indexOf(this.findListener(topic));
        if (index >= 0)
            this.listeners.splice(index, 1);
    }
    /**
     * Fires then the DataChannel is ready and open
     *
     * @param {Event} event
     * @param {string} peerId
     * @memberof DataChannel
     */
    OnOpen(event: Event, peerId: string) { }    
    /**
     * Fires when the DataChannel is closed or lost
     *
     * @param {Event} event
     * @param {string} peerId
     * @memberof DataChannel
     */
    OnClose(event: Event, peerId: string) { }
    
    /**
     * Do not overide this method, unless you need it.
     *
     * @param {MessageEvent} event
     * @memberof DataChannel
     */
    onMessage(event: MessageEvent) {
        var msg = JSON.parse(event.data);
        var listener = this.findListener(msg.T);
        if (listener)
            listener.fn.apply(this, [JSON.parse(msg.D)]);
    }
    /**
     * Close the DataChannel
     *
     * @memberof DataChannel
     */
    Close() {
        this.PeerChannels.forEach((pc: PeerChannel) => {
            pc.dataChannel.close();
        });
    } 
    /**
     * Send a message to peers 
     *
     * @param {string} topic
     * @param {*} data
     * @param {string} [controller]
     * @returns {DataChannel}
     * @memberof DataChannel
     */
    Invoke(topic: string, data: any, controller?: string): DataChannel {
        this.PeerChannels.forEach((channel: PeerChannel) => {
            if (channel.dataChannel.readyState === "open") {
                channel.dataChannel.send(new TextMessage(topic, data, this.Name).toString());
            }
        });
        return this;
    }
    addPeerChannel(pc: PeerChannel) {
        this.PeerChannels.push(pc);
    }
    removePeerChannel(id:any) {
        let match = this.PeerChannels.find((p: PeerChannel) => {
            return p.peerId === id;
        });
        let index = this.PeerChannels.indexOf(match);
        if (index > -1)
            this.PeerChannels.splice(index, 1);
    }
}
