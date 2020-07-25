import { Controller } from "../Controller/Controller";
/**
 * Create a connection to a thor-io.vnext server and its controllers
 *
 * @export
 * @class Factory
 */
export declare class ClientFactory {
    private url;
    private ws;
    private toQuery;
    private controllers;
    IsConnected: boolean;
    /**
     * Creates an instance of Factory (Connection).
     * @param {string} url
     * @param {Array<string>} controllers
     * @param {*} [params]
     * @memberof Factory
     */
    constructor(url: string, controllers: Array<string>, params?: any);
    /**
     * Close the connection
     *
     * @memberof Factory
     */
    close(): void;
    /**
     * Get a proxy aka controller
     *
     * @param {string} alias
     * @returns {Controller}
     * @memberof Factory
     */
    getController(alias: string): Controller;
    /**
     * Remove the controller
     *
     * @param {string} alias
     * @memberof Factory
     */
    removeController(alias: string): void;
    /**
     * Fires when connection is established to the thor-io.vnext server
     *
     * @param {*} proxys
     * @memberof Factory
     */
    onOpen(controllers: any): void;
    /**
     *  Fires when a connection goes wrong
     *
     * @param {*} error
     * @memberof Factory
     */
    onError(error: any): void;
    /**
    *  Fires when a connection is closed by the thor-io.vnext server
    *
    * @param {*} error
    * @memberof Factory
    */
    onClose(event: any): void;
}
