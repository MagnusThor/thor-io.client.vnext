export interface IClientInfo {
    CI: string;
    C: string;
    TS: Date;
}
export declare class ClientInfo implements IClientInfo {
    CI: string;
    C: string;
    TS: Date;
    constructor(ci: string, controller: string);
}
