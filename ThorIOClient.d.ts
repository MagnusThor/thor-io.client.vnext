export declare namespace ThorIOClient {
    class BinaryMessage {
        arrayBuffer: ArrayBuffer;
        Buffer: ArrayBuffer;
        private header;
        static fromArrayBuffer(buffer: ArrayBuffer): any;
        constructor(message: string, arrayBuffer: ArrayBuffer);
        private joinBuffers(a, b);
    }
    class Message {
        B: ArrayBuffer;
        T: string;
        D: any;
        C: string;
        readonly JSON: any;
        constructor(topic: string, object: any, controller: string, buffer?: ArrayBuffer);
        toString(): string;
        static fromArrayBuffer(buffer: ArrayBuffer): any;
    }
    class PeerConnection {
        context: string;
        peerId: string;
    }
    class WebRTCConnection {
        id: string;
        RTCPeer: RTCPeerConnection;
        streams: Array<any>;
        constructor(id: string, rtcPeerConnection: RTCPeerConnection);
    }
    class Recorder {
        private stream;
        private mimeType;
        private ignoreMutedMedia;
        private recorder;
        private blobs;
        IsRecording: boolean;
        constructor(stream: MediaStream, mimeType: string, ignoreMutedMedia: any);
        private handleStop(event);
        OnRecordComplated(blob: any, blobUrl: string): void;
        private handleDataAvailable(event);
        IsTypeSupported(type: string): void;
        GetStats(): any;
        Stop(): void;
        Start(ms: number): void;
    }
    class PeerChannel {
        dataChannel: RTCDataChannel;
        peerId: string;
        label: string;
        constructor(peerId: any, dataChannel: any, label: any);
    }
    class DataChannel {
        private listeners;
        Name: string;
        PeerChannels: Array<PeerChannel>;
        constructor(name: string, listeners?: Array<Listener>);
        On(topic: string, fn: any): Listener;
        OnOpen(event: Event, peerId: string): void;
        OnClose(event: Event, peerId: string): void;
        OnMessage(event: MessageEvent): void;
        Close(): void;
        private findListener(topic);
        Off(topic: string): void;
        Invoke(topic: string, data: any, controller?: string): ThorIOClient.DataChannel;
        AddPeerChannel(pc: PeerChannel): void;
        RemovePeerChannel(id: any, dataChannel: any): void;
    }
    class BandwidthConstraints {
        videobandwidth: number;
        audiobandwidth: number;
        constructor(videobandwidth: number, audiobandwidth: number);
    }
    class WebRTC {
        private brokerProxy;
        private rtcConfig;
        Peers: Array<WebRTCConnection>;
        Peer: RTCPeerConnection;
        DataChannels: Array<DataChannel>;
        LocalPeerId: string;
        Context: string;
        LocalStreams: Array<any>;
        Errors: Array<any>;
        bandwidthConstraints: BandwidthConstraints;
        constructor(brokerProxy: ThorIOClient.Proxy, rtcConfig: any);
        setBandwithConstraints(videobandwidth: number, audiobandwidth: number): void;
        private setMediaBitrates(sdp);
        private setMediaBitrate(sdp, media, bitrate);
        CreateDataChannel(name: string): ThorIOClient.DataChannel;
        RemoveDataChannel(name: string): void;
        private signalHandlers();
        private addError(err);
        OnError: (err: any) => void;
        OnContextCreated: (peerConnection: PeerConnection) => void;
        OnContextChanged: (context: string) => void;
        OnRemoteStream: (stream: MediaStream, connection: WebRTCConnection) => void;
        OnRemoteStreamlost: (streamId: string, peerId: string) => void;
        OnLocalStream: (stream: MediaStream) => void;
        OnContextConnected: (rtcPeerConnection: RTCPeerConnection) => void;
        OnContextDisconnected: (rtcPeerConnection: RTCPeerConnection) => void;
        OnConnectTo(peerConnections: Array<PeerConnection>): void;
        OnConnected(peerId: string): void;
        OnDisconnected(peerId: string): void;
        private onCandidate(event);
        private onAnswer(event);
        private onOffer(event);
        AddLocalStream(stream: any): WebRTC;
        AddIceServer(iceServer: RTCIceServer): WebRTC;
        private removePeerConnection(id);
        private createPeerConnection(id);
        findPeerConnection(pre: Function): Array<WebRTCConnection>;
        private getPeerConnection(id);
        private createOffer(peer);
        Disconnect(): void;
        Connect(peerConnections: Array<PeerConnection>): WebRTC;
        ChangeContext(context: string): WebRTC;
        ConnectPeers(): void;
        ConnectContext(): void;
    }
    class Factory {
        private url;
        private ws;
        private toQuery(obj);
        private proxys;
        IsConnected: boolean;
        constructor(url: string, controllers: Array<string>, params?: any);
        Close(): void;
        GetProxy(alias: string): ThorIOClient.Proxy;
        RemoveProxy(alias: string): void;
        OnOpen(proxys: any): void;
        OnError(error: any): void;
        OnClose(event: any): void;
    }
    class Listener {
        fn: Function;
        topic: string;
        count: number;
        constructor(topic: string, fn: Function);
    }
    class Utils {
        static stingToBuffer(str: string): Uint8Array;
        static arrayToLong(byteArray: Uint8Array): number;
        static longToArray(long: number): Uint8Array;
        static newGuid(): string;
    }
    class PropertyMessage {
        name: string;
        value: any;
        messageId: string;
        constructor();
    }
    class Proxy {
        alias: string;
        private ws;
        IsConnected: boolean;
        private listeners;
        constructor(alias: string, ws: WebSocket);
        OnError(event: any): void;
        OnOpen(event: any): void;
        OnClose(event: any): void;
        Connect(): this;
        Close(): this;
        Subscribe(topic: string, callback: any): Listener;
        Unsubscribe(topic: string): void;
        On(topic: string, fn: any): Listener;
        private findListener(topic);
        Off(topic: string): void;
        InvokeBinary(buffer: ArrayBuffer): ThorIOClient.Proxy;
        PublishBinary(buffer: ArrayBuffer): ThorIOClient.Proxy;
        Invoke(topic: string, data: any, controller?: string): ThorIOClient.Proxy;
        Publish(topic: string, data: any, controller?: string): ThorIOClient.Proxy;
        SetProperty(propName: string, propValue: any, controller?: string): ThorIOClient.Proxy;
        Dispatch(topic: string, data: any, buffer?: ArrayBuffer): void;
    }
}
