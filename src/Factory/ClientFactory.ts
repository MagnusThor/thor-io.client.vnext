import { BinaryMessage } from "../Messages/BinaryMessage";
import { Controller } from "../Controller/Controller";

/**
 * Create a connection to a thor-io.vnext server and its controllers
 *
 * @export
 * @class ClientFactory
 */
export class ClientFactory {
    private ws: WebSocket;
    private toQuery(obj: any) {
        return `?${Object.keys(obj).map(key => (encodeURIComponent(key) + "=" +
            encodeURIComponent(obj[key]))).join("&")}`;
    }
    private controllers: Map<string,Controller>
    public IsConnected: boolean;   
    /**
     * Creates an instance of Factory (Connection).
     * @param {string} url
     * @param {Array<string>} controllers
     * @param {*} [params]
     * @memberof ClientFactory
     */
    constructor(private url: string, controllers: Array<string>, params?: any) {
        this.controllers = new Map<string,Controller>();
        this.ws = new WebSocket(url + this.toQuery(params || {}));
        this.ws.binaryType = "arraybuffer";
        controllers.forEach(alias => {
            this.controllers.set(alias,new Controller(alias, this.ws));
        });
        this.ws.onmessage = event => {
            if (typeof (event.data) !== "object") {
                let message = JSON.parse(event.data);
                this.getController(message.C).dispatch(message.T, message.D);
            }
            else {
                let message = BinaryMessage.fromArrayBuffer(event.data);
                this.getController(message.C).dispatch(message.T, message.D, message.B);
            }
        };
        this.ws.onclose = event => {
            this.IsConnected = false;
            this.onClose.apply(this, [event]);
        };
        this.ws.onerror = error => {
            this.onError.apply(this, [error]);
        };
        this.ws.onopen = event => {
            this.IsConnected = true;
            this.onOpen.apply(this, Array.from(this.controllers.values()));
        };
    }
    /**
     * Close the connection
     *
     * @memberof ClientFactory
     */
    close() {
        this.ws.close();
    }
    /**
     * Get a Controller
     *
     * @param {string} alias
     * @returns {Controller}
     * @memberof ClientFactory
     */
    getController(alias: string): Controller {
        return this.controllers.get(alias);        
    }    
    /**
     * Remove the controller
     *
     * @param {string} alias
     * @memberof ClientFactory
     */
    removeController(alias: string) {
        this.controllers.delete(alias);       
    }
    /**
     * Fires when connection is established to the thor-io.vnext server
     *
     * @param {*} proxys
     * @memberof ClientFactory
     */
    onOpen(controllers: any) { }
    /**
     *  Fires when a connection goes wrong
     *
     * @param {*} error
     * @memberof ClientFactory
     */
    onError(error: any) { }
     /**
     *  Fires when a connection is closed by the thor-io.vnext server
     *
     * @param {*} error
     * @memberof ClientFactory
     */
    onClose(event: any) { }
}
