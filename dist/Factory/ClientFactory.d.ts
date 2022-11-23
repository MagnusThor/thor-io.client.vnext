import { Controller } from "../Controller/Controller";
export declare class ClientFactory {
    private url;
    private ws;
    private toQuery;
    private controllers;
    IsConnected: boolean;
    constructor(url: string, controllers: Array<string>, params?: any);
    close(): void;
    getController(alias: string): Controller;
    removeController(alias: string): void;
    onOpen(controllers: any): void;
    onError(error: any): void;
    onClose(event: any): void;
}
