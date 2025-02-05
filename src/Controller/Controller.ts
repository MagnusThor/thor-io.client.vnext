import { Listener } from '../Events/Listener';
import { TextMessage } from '../Messages/TextMessage';

/**
 * Creates a client controller (proxy) for a Thor.io.vnext controller.
 *
 * This class manages the connection and communication with a Thor.io.vnext server controller.
 */
export class Controller {
  isConnected: boolean;
  private listeners: Map<string, Listener>;

  /**
   * Creates a new Controller instance.
   *
   * @param alias The alias of this controller on the server.
   * @param ws The WebSocket connection to the server.
   */
  constructor(public alias: string, private ws: WebSocket) {
    this.listeners = new Map<string, Listener>();
    this.isConnected = false;

    this.on("___error", (err: any) => {
      this.onError(err);
    });
  }

  /**
   * Handles errors received from the server.
   *
   * @param event The error event.
   */
  onError(event: any) {
    // Implement error handling logic here (e.g., log, retry connection, etc.)
  }

  /**
   * Handles successful connection establishment.
   *
   * @param event The connection open event.
   */
  onOpen(event: any) {
    // Implement actions to be performed after successful connection (e.g., log, start operations)
  }

  /**
   * Handles connection closure.
   *
   * @param event The connection close event.
   */
  onClose(event: any) {
    // Implement actions to be performed after connection closure (e.g., clean up resources)
  }

  /**
   * Connects to the server controller.
   *
   * @returns The current Controller instance for chaining.
   */
  connect(): Controller {
    this.ws.send(new TextMessage("___connect", {}, this.alias, undefined, undefined, true).toString());
    return this;
  }

  /**
   * Closes the connection to the server controller.
   *
   * @returns The current Controller instance for chaining.
   */
  close(): Controller {
    this.ws.send(new TextMessage("___close", {}, this.alias, undefined, undefined, true).toString());
    return this;
  }

  /**
   * Subscribes to a specific topic and registers a callback function.
   *
   * @param topic The topic to subscribe to.
   * @param fn The callback function to be executed when a message is received.
   * @returns The registered Listener instance.
   */
  subscribe<T>(topic: string, fn: (data: T, buffer?: ArrayBuffer) => void): Listener {
    this.ws.send(new TextMessage("___subscribe", { topic: topic, controller: this.alias }, this.alias).toString());
    return this.on(topic, fn);
  }

  /**
   * Unsubscribes from a topic.
   *
   * @param topic The topic to unsubscribe from.
   */
  unsubscribe(topic: string) {
    this.ws.send(new TextMessage("___unsubscribe", { topic: topic, controller: this.alias }, this.alias).toString());
  }

  /**
   * Registers a listener for RPC calls on a topic.
   *
   * @param topic The topic to listen for.
   * @param fn The callback function to be executed when a message is received.
   * @returns The registered Listener instance.
   */
  on<T>(topic: string, fn: (data: T, buffer?: ArrayBuffer) => void): Listener {
    const listener = new Listener(topic, fn);
    this.listeners.set(topic, listener);
    return listener;
  }

  /**
   * Retrieves a registered listener for a specific topic.
   *
   * @param topic The topic to find the listener for.
   * @returns The registered Listener instance, or undefined if no listener is found.
   */
  private findListener(topic: string): Listener | undefined {
    return this.listeners.get(topic);
  }

  /**
   * Sends a binary message to the server.
   *
   * @param buffer The ArrayBuffer containing the binary data.
   * @returns The current Controller instance for chaining.
   * @throws Error if the provided data is not an ArrayBuffer.
   */
  invokeBinary(buffer: ArrayBuffer): Controller {
    if (buffer instanceof ArrayBuffer) {
      this.ws.send(buffer);
      return this;
    } else {
      throw new Error("parameter provided must be an ArrayBuffer constructed by BinaryMessage");
    }
  }

  /**
   * Publishes a binary message on a specific topic.
   *
   * @param buffer The ArrayBuffer containing the binary data.
   * @returns The current Controller instance for chaining.
   * @throws Error if the provided data is not an ArrayBuffer.
   */
  publishBinary(buffer: ArrayBuffer): Controller {
    if (buffer instanceof ArrayBuffer) {
      this.ws.send(buffer);
      return this;
    } else {
      throw new Error("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
    }
  }

  /**
   * Invokes a method (RPC call) on the server controller.
   *
   * @param method The name of the method to invoke.
   * @param data The data to send with the method invocation.
   * @param controller Optional controller alias for the target.
   * @returns The current Controller instance for chaining.
   */
  invoke<T>(method: string, data: T, controller?: string): Controller {
    this.ws.send(new TextMessage(method, data, controller || this.alias, undefined, undefined, true).toString());
    return this;
  }

  /**
   * Publishes a message on a specific topic.
   *
   * @param topic The topic to publish the message on.
   * @param data The data to publish.
   * @param controller Optional controller alias for the target.
   * @returns The current Controller instance for chaining.
   */
  publish<T>(topic: string, data: T, controller?: string): Controller {
    this.invoke(topic, data, controller || this.alias);
    return this;
  }

  /**
   * Sets a property value on the server controller.
   *
   * @param propName The name of the property to set.
   * @param propValue The value to set for the property.
   * @param controller Optional controller alias for the target.
   * @returns The current Controller instance for chaining.
   */
  setProperty<T>(propName: string, propValue: T, controller?: string): Controller {
    this.invoke<T>(propName, propValue, controller || this.alias);
    return this;
  }

  /**
   * Dispatches an event (message) to the registered listeners.
   *
   * @param topic The topic of the message.
   * @param data The data associated with the message.
   * @param buffer Optional binary data associated with the message.
   */
  dispatch(topic: string, data: any, buffer?: ArrayBuffer | Uint8Array) {
    if (topic === "___open") {
      this.isConnected = true;
      this.onOpen(JSON.parse(data));
    } else if (topic === "___close") {
      this.onClose([JSON.parse(data)]);
      this.isConnected = false;
    } else {
      const listener = this.findListener(topic);
      if (listener) {
        listener.action(JSON.parse(data), buffer);
      }
    }
  }
}