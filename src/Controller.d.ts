import { Listener } from "./Listener";
export declare class Controller {
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
    Off(topic: string): void;
    private findListener;
    InvokeBinary(buffer: ArrayBuffer): Controller;
    PublishBinary(buffer: ArrayBuffer): Controller;
    Invoke(method: string, data: any, controller?: string): Controller;
    Publish(topic: string, data: any, controller?: string): Controller;
    SetProperty(propName: string, propValue: any, controller?: string): Controller;
    Dispatch(topic: string, data: any, buffer?: ArrayBuffer | Uint8Array): void;
}
