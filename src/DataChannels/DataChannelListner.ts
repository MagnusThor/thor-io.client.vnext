import { Listener } from '../Events/Listener';

export class DataChannelListner extends Listener {
    channelName: string;
    constructor(channelName: string, topic: string, fn:  (data:any,buffer?:ArrayBuffer)=>void ) {
        super(topic, fn);
        this.channelName = channelName;
        this.count = 0;
    }
}
