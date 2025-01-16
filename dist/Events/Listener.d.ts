export declare class Listener {
    action: (data: any, buffer?: ArrayBuffer) => void;
    topic: string;
    count: number;
    constructor(topic: string, action: (data: any, buffer?: ArrayBuffer) => void);
}
