export interface IE2EE {
    decode(frame: any, controller: any): any;
    encode(frame: any, controller: any): any;
    setKey(key: string): void;
}
export declare class E2EEBase implements IE2EE {
    private frameTypeToCryptoOffset;
    useCryptoOffset: boolean;
    currentKeyIdentifier: number;
    rcount: number;
    scount: number;
    private currentCryptoKey;
    constructor(currentCryptoKey: string);
    setKey(key: string): void;
    dump(encodedFrame: any, direction: any, max?: number): void;
    encode(encodedFrame: any, controller: any): void;
    decode(encodedFrame: any, controller: any): void;
}
