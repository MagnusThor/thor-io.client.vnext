import { Controller } from "./Controller";
export declare class Factory {
    private url;
    private ws;
    private toQuery;
    private controllers;
    IsConnected: boolean;
    constructor(url: string, controllers: Array<string>, params?: any);
    Close(): void;
    GetController(alias: string): Controller;
    RemoveController(alias: string): void;
    OnOpen(controllers: any): void;
    OnError(error: any): void;
    OnClose(event: any): void;
}
