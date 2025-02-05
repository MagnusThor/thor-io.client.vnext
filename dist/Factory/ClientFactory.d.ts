import { Controller } from '../Controller/Controller';
export declare class ClientFactory {
    private ws;
    private toQuery;
    private controllers;
    IsConnected: boolean;
    constructor(url: string, controllers: Array<string>, params?: any);
    close(): void;
    connectAllControllers(): void;
    getController(alias: string): Controller;
    removeController(alias: string): void;
    onOpen(...args: Controller[]): void;
    onError(error: any): void;
    onClose(event: any): void;
}
