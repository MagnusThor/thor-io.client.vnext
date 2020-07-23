import { Listener } from "./Listener";
export declare class Controller {
    alias: string;
    private ws;
    isConnected: boolean;
    private listeners;
    constructor(alias: string, ws: WebSocket);
    onError(event: any): void;
    onOpen(event: any): void;
    onClose(event: any): void;
    connect(): this;
    close(): this;
    subscribe(topic: string, callback: any): Listener;
    unsubscribe(topic: string): void;
    on(topic: string, fn: any): Listener;
    of(topic: string): void;
    private findListener;
    invokeBinary(buffer: ArrayBuffer): Controller;
    publishBinary(buffer: ArrayBuffer): Controller;
    invoke(method: string, data: any, controller?: string): Controller;
    publish(topic: string, data: any, controller?: string): Controller;
    setProperty(propName: string, propValue: any, controller?: string): Controller;
    dispatch(topic: string, data: any, buffer?: ArrayBuffer | Uint8Array): void;
}
