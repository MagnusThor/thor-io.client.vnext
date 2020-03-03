import { TextMessage } from "../Messages/TextMessage";
import { PeerChannel } from "./PeerChannel";
import { Listener } from "../Listener";

export class DataChannel {
    private listeners: Array<Listener>;
    public Name: string;
    public PeerChannels: Array<PeerChannel>;
    constructor(name: string, listeners?: Array<Listener>) {
        this.listeners = listeners || new Array<Listener>();
        this.PeerChannels = new Array<PeerChannel>();
        this.Name = name;
    }
    On(topic: string, fn: any): Listener {
        var listener = new Listener(topic, fn);
        this.listeners.push(listener);
        return listener;
    }
    ;
    OnOpen(event: Event, peerId: string) { }
    ;
    OnClose(event: Event, peerId: string) { }
    OnMessage(event: MessageEvent) {
        var msg = JSON.parse(event.data);
        var listener = this.findListener(msg.T);
        if (listener)
            listener.fn.apply(this, [JSON.parse(msg.D)]);
    }
    Close() {
        this.PeerChannels.forEach((pc: PeerChannel) => {
            pc.dataChannel.close();
        });
    }
    private findListener(topic: string): Listener {
        let listener = this.listeners.find((pre: Listener) => {
            return pre.topic === topic;
        });
        return listener;
    }
    Off(topic: string) {
        let index = this.listeners.indexOf(this.findListener(topic));
        if (index >= 0)
            this.listeners.splice(index, 1);
    }
    ;
    Invoke(topic: string, data: any, controller?: string): DataChannel {
        this.PeerChannels.forEach((channel: PeerChannel) => {
            if (channel.dataChannel.readyState === "open") {
                channel.dataChannel.send(new TextMessage(topic, data, this.Name).toString());
            }
        });
        return this;
    }
    AddPeerChannel(pc: PeerChannel) {
        this.PeerChannels.push(pc);
    }
    RemovePeerChannel(id:any) {
        let match = this.PeerChannels.find((p: PeerChannel) => {
            return p.peerId === id;
        });
        let index = this.PeerChannels.indexOf(match);
        if (index > -1)
            this.PeerChannels.splice(index, 1);
    }
}
