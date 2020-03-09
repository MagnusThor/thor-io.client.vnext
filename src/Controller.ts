import { TextMessage } from "./Messages/TextMessage";
import { Listener } from "./Listener";
/**
 * Create a client controller(proxy) that for a thor-io.vnext controller
 *
 * @export
 * @class Controller
 */
export class Controller {
    IsConnected: boolean;
    private listeners: Map<string,Listener>;
    constructor(public alias: string, private ws: WebSocket) {
        this.listeners = new Map<string,Listener>();
        this.IsConnected = false;
        this.On("___error", (err: any) => {
            this.OnError(err);
        });
    }
    /** 
     * Fires when an error occurs
     *
     * @param {*} event
     * @memberof Controller
     */
    OnError(event: any) { }
    /**
     * Fires when sucessfully created a connection to the thor-io.vnext sever controller
     *
     * @param {*} event
     * @memberof Controller
     */
    OnOpen(event: any) { }
    /**
     *Fires when the controller's connection closed.
     *
     * @param {*} event
     * @memberof Controller
     */
    OnClose(event: any) { }
    /**
     * Connect the controller (create an new instance of the thor-io.vnext server controller)
     *
     * @returns
     * @memberof Controller
     */
    Connect() {
        this.ws.send(new TextMessage("___connect", {}, this.alias).toString());
        return this;
    }
    ;
    /**
      *Close the connction
     *
     * @returns
     * @memberof Controller
     */
    Close() {
        this.ws.send(new TextMessage("___close", {}, this.alias).toString());
        return this;
    }
    ;
    /**
     * Create a subscription 
     *
     * @param {string} topic
     * @param {*} callback
     * @returns {Listener}
     * @memberof Controller
     */
    Subscribe(topic: string, callback: any): Listener {
        this.ws.send(new TextMessage("___subscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
        return this.On(topic, callback);
    }
    /**
     * Remove a subscription
     *
     * @param {string} topic
     * @memberof Controller
     */
    Unsubscribe(topic: string) {
        this.ws.send(new TextMessage("___unsubscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
    }
    /**
     * Create a listner for RPC calls
     *
     * @param {string} topic
     * @param {*} fn
     * @returns {Listener}
     * @memberof Controller
     */
    On(topic: string, fn: any): Listener {
        let listener = new Listener(topic, fn);
        this.listeners.set(topic,listener);
        return listener;
    }
     /**
     * Delete a listener for RPC calls
     *
     * @param {string} topic
     * @memberof Controller
     */
    Off(topic: string) {
        this.listeners.delete(topic);
    }
    private findListener(topic: string): Listener {
      
        return this.listeners.get(topic);
    }   
    /**
     * Send and ArrayBuffer
     *
     * @param {ArrayBuffer} buffer
     * @returns {Controller}
     * @memberof Controller
     */
    InvokeBinary(buffer: ArrayBuffer): Controller {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    }
    /**
     * Publish a BinaryMessage on the specific topic
     *
     * @param {ArrayBuffer} buffer
     * @returns {Controller}
     * @memberof Controller
     */
    PublishBinary(buffer: ArrayBuffer): Controller {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    }
    /**
     * Call a method (rpc) on the contorller
     *
     * @param {string} method
     * @param {*} data
     * @param {string} [controller]
     * @returns {Controller}
     * @memberof Controller
     */
    Invoke(method: string, data: any, controller?: string): Controller {
        this.ws.send(new TextMessage(method, data, controller || this.alias).toString());
        return this;
    }    
    /**
     * Publish a message on the specific topic
     *
     * @param {string} topic
     * @param {*} data
     * @param {string} [controller]
     * @returns {Controller}
     * @memberof Controller
     */
    Publish(topic: string, data: any, controller?: string): Controller {
        this.Invoke(topic,data,controller || this.alias);
         return this;
    }
    /**
     * Set a propety value on the controller
     *
     * @param {string} propName
     * @param {*} propValue
     * @param {string} [controller]
     * @returns {Controller}
     * @memberof Controller
     */
    SetProperty(propName: string, propValue: any, controller?: string): Controller {
        this.Invoke(propName, propValue, controller || this.alias);
        return this;
    }  
     /**
      * Dispatch an even (message) to the listeners
      *
      * @param {string} topic
      * @param {*} data
      * @param {(ArrayBuffer | Uint8Array)} [buffer]
      * @returns
      * @memberof Controller
      */
     Dispatch(topic: string, data: any, buffer?: ArrayBuffer | Uint8Array) {
        if (topic === "___open") {
            this.IsConnected = true;
            this.OnOpen(JSON.parse(data));
            return;
        }
        else if (topic === "___close") {
            this.OnClose([JSON.parse(data)]);
            this.IsConnected = false;
        }
        else {
            let listener = this.findListener(topic);
            if (listener)
                listener.fn(JSON.parse(data), buffer);
        }
    }
}
