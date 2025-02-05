import { Controller } from '../Controller/Controller';
import { BinaryMessage } from '../Messages/BinaryMessage';

/**
 * Create a connection to a thor-io.vnext server and its controllers.
 *
 * @export
 * @class ClientFactory
 */
export class ClientFactory {
  private ws: WebSocket;

  /**
   * Converts an object to a query string.
   *
   * @private
   * @param {Object} obj The object to convert.
   * @returns {string} The resulting query string.
   */
  private toQuery(obj: any): string {
    return `?${Object.keys(obj)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
      .join("&")}`;
  }

  private controllers: Map<string, Controller>;

  /** Flag indicating if the connection is established */
  public IsConnected: boolean = false;

  /**
   * Creates an instance of ClientFactory.
   *
   * @param {string} url The URL of the thor-io.vnext server.
   * @param {Array<string>} controllers An array of controller aliases.
   * @param {*} [params] Optional connection parameters.
   * @memberof ClientFactory
   */
  constructor(url: string, controllers: Array<string>, params?: any) {
    this.controllers = new Map<string, Controller>();
    this.ws = new WebSocket(url + this.toQuery(params || {}));
    this.ws.binaryType = "arraybuffer";

    controllers.forEach((alias) => {
      this.controllers.set(alias, new Controller(alias, this.ws));
    });

    this.ws.onmessage = (event) => {
      if (typeof event.data !== "object") {
        const message = JSON.parse(event.data);
        this.getController(message.C).dispatch(message.T, message.D);
      } else {
        const message = BinaryMessage.fromArrayBuffer(event.data);
        this.getController(message.C).dispatch(message.T, message.D, message.B);
      }
    };

    this.ws.onclose = (event) => {
      this.IsConnected = false;
      this.onClose.apply(this, [event]);
    };

    this.ws.onerror = (error) => {
      this.onError.apply(this, [error]);
    };

    this.ws.onopen = (event) => {
      this.IsConnected = true;
      this.onOpen.apply(this, Array.from(this.controllers.values()));
    };
  }

  /**
   * Closes the connection to the thor-io.vnext server.
   *
   * @memberof ClientFactory
   */
  close() {
    this.ws.close();
  }

  /**
   * Connects all registered controllers.
   *
   * @memberof ClientFactory
   */
  connectAllControllers(): void {
    this.controllers.forEach((controller) => controller.connect());
  }

  /**
   * Gets a controller by its alias.
   *
   * @param {string} alias The alias of the controller.
   * @returns {Controller} The controller instance.
   * @memberof ClientFactory
   */
  getController(alias: string): Controller {
    return this.controllers.get(alias) as Controller;
  }

  /**
   * Removes a controller by its alias.
   *
   * @param {string} alias The alias of the controller to remove.
   * @memberof ClientFactory
   */
  removeController(alias: string): void {
    this.controllers.delete(alias);
  }

  /**
   * Fires when connection is established to the thor-io.vnext server.
   *
   * @param {...Controller[]} args Controllers that are connected.
   * @memberof ClientFactory
   */
  onOpen(...args: Controller[]): void {}

  /**
   * Fires when a connection error occurs.
   *
   * @param {*} error The error object.
   * @memberof ClientFactory
   */
  onError(error: any): void {}

  /**
   * Fires when the connection to the thor-io.vnext server is closed.
   *
   * @param {*} event The close event object.
   * @memberof ClientFactory
   */
  onClose(event: any): void {}
}