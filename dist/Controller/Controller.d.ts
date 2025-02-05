import { Listener } from '../Events/Listener';
export declare class Controller {
    alias: string;
    private ws;
    isConnected: boolean;
    private listeners;
    constructor(alias: string, ws: WebSocket);
    onError(event: any): void;
    onOpen(event: any): void;
    onClose(event: any): void;
    connect(): Controller;
    close(): Controller;
    subscribe<T>(topic: string, fn: (data: T, buffer?: ArrayBuffer) => void): Listener;
    unsubscribe(topic: string): void;
    on<T>(topic: string, fn: (data: T, buffer?: ArrayBuffer) => void): Listener;
    private findListener;
    invokeBinary(buffer: ArrayBuffer): Controller;
    publishBinary(buffer: ArrayBuffer): Controller;
    invoke<T>(method: string, data: T, controller?: string): Controller;
    publish<T>(topic: string, data: T, controller?: string): Controller;
    setProperty<T>(propName: string, propValue: T, controller?: string): Controller;
    dispatch(topic: string, data: any, buffer?: ArrayBuffer | Uint8Array): void;
}
