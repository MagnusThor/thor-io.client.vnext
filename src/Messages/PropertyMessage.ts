import { Utils } from '../Utils/Utils';

/**
 * A class representing a message that wraps a property and its value.
 *
 * This class provides a way to encapsulate a property name, its value, and a unique message ID.
 * It can be used for sending and receiving messages that involve setting or getting properties.
 *
 * @typeparam T The type of the property value.
 */
export class PropertyMessage<T> {
    /**
     * The name of the property associated with this message.
     */
    name: string;
  
    /**
     * The value of the property, or undefined if not set.
     */
    value: T | undefined;
  
    /**
     * A unique identifier for this message.
     */
    messageId: string;
  
    /**
     * Creates a new PropertyMessage instance.
     *
     * @param name The name of the property.
     */
    constructor(name: string) {
      this.messageId = Utils.newGuid();
      this.name = name;
    }
  }