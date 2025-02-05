import { TextMessage } from '../Messages/TextMessage';
import { DataChannelListener } from './DataChannelListener';
import { PeerChannel } from './PeerChannel';
export declare class DataChannel {
    Listners: Map<string, DataChannelListener>;
    label: string;
    PeerChannels: Map<{
        id: string;
        name: string;
    }, PeerChannel>;
    messageFragments: Map<string, {
        msg: TextMessage;
        receiveBuffer: ArrayBuffer;
    }>;
    constructor(label: string, listeners?: Map<string, DataChannelListener>);
    private findListener;
    on<T>(topic: string, fn: (message: T, arrayBuffer?: ArrayBuffer) => void): DataChannelListener;
    off(topic: string): boolean;
    onOpen(event: Event, peerId: string, name: string): void;
    onClose(event: Event, peerId: string, name: string): void;
    private addMessageFragment;
    private dispatchMessage;
    onMessage(event: MessageEvent): void;
    close(name?: string): void;
    invoke(topic: string, data: any, isFinal?: boolean, uuid?: string): DataChannel;
    invokeBinary(topic: string, data: any, arrayBuffer: ArrayBuffer, isFinal: boolean, uuid?: string): DataChannel;
    addPeerChannel(pc: PeerChannel): void;
    removePeerChannel(id: any): boolean;
}
