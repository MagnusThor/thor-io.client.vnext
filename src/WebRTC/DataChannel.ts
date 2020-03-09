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
    private listeners: Map<string,Listener>;
    public Name: string;
    public PeerChannels: Map<string,PeerChannel>;
    constructor(name: string, listeners?: Map<string,Listener>) {
        this.listeners = listeners || new Map<string,Listener>();
        this.PeerChannels = new Map<string,PeerChannel>();
        this.Name = name;
    }
    private findListener(topic: string): Listener {
        return this.listeners.get(topic);       
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
        this.listeners.set(topic,listener);
        return listener;
    }
    /**
     * Remove a listener for specific topic  
     *
     * @param {string} topic
     * @memberof DataChannel
     */
    Off(topic: string):boolean {
       return this.listeners.delete(topic)
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
       this.PeerChannels.set(pc.peerId,pc); 
    }
    removePeerChannel(id:any):boolean {
      return this.PeerChannels.delete(id);
    }
}
