import { TextMessage } from "../Messages/TextMessage";
import { PeerChannel } from "./PeerChannel";
import { DataChannelListner } from "../DataChannels/DataChannelListner";
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
    On<T>(topic: string, fn: (message: T, arrayBuffer: ArrayBuffer) => void): DataChannelListner;
    Off(topic: string): boolean;
    OnOpen(event: Event, peerId: string, name: string): void;
    OnClose(event: Event, peerId: string, name: string): void;
    private addMessageFragment;
    private dispatchMessage;
    onMessage(event: MessageEvent): void;
    Close(name?: string): void;
    Invoke(topic: string, data: any, isFinal?: boolean, uuid?: string): DataChannel;
    InvokeBinary(topic: string, data: any, arrayBuffer: ArrayBuffer, isFinal: boolean, uuid?: string): DataChannel;
    addPeerChannel(pc: PeerChannel): void;
    removePeerChannel(id: any): boolean;
}
