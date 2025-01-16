import { Listener } from '../Events/Listener';
export declare class DataChannelListner extends Listener {
    channelName: string;
    constructor(channelName: string, topic: string, fn: (data: any, buffer?: ArrayBuffer) => void);
}
