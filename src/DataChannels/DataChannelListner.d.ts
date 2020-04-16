import { Listener } from "../Listener";
export declare class DataChannelListner extends Listener {
    channelName: string;
    constructor(channelName: string, topic: string, fn: Function);
}
