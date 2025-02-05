import { Listener } from '../Events/Listener';

/**
 * Represents a listener for messages received on a specific data channel.

 * This class extends the base `Listener` class and adds a property to track the 
 * name of the data channel associated with the listener.
 */
export class DataChannelListener extends Listener {
  /**
   * The name of the data channel this listener is associated with.
   */
  channelName: string;

  /**
   * Creates a new DataChannelListener instance.

   * @param channelName The name of the data channel.
   * @param topic The topic to listen for.
   * @param fn The callback function to be executed when a message is received.
   */
  constructor(channelName: string, topic: string, fn: (data: any, buffer?: ArrayBuffer) => void) {
    super(topic, fn);
    this.channelName = channelName;
    this.count = 0; 
  }
}