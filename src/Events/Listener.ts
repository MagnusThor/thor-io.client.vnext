/**
 * Represents a listener for Thor.io.vnext message events.

 * This class encapsulates information about a specific message listener, 
 * including the topic it listens for, the callback function to be executed 
 * when a message is received, and a counter to track the number of times 
 * the listener has been invoked.
 */
export class Listener {
    /**
     * The callback function to be executed when a message is received.
     * 
     * @param data The data payload of the received message.
     * @param buffer Optional binary data associated with the message.
     */
    action: (data: any, buffer?: ArrayBuffer) => void;
  
    /**
     * The topic that this listener is subscribed to.
     */
    topic: string;
  
    /**
     * The number of times this listener has been invoked.
     */
    count: number;
  
    /**
     * Creates a new Listener instance.
     *
     * @param topic The topic to listen for.
     * @param action The callback function to be executed when a message is received.
     */
    constructor(topic: string, action: (data: any, buffer?: ArrayBuffer) => void) {
      this.action = action;
      this.topic = topic;
      this.count = 0;
    }
  }