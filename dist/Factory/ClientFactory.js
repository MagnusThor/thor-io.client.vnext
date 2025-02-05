"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientFactory = void 0;
const Controller_1 = require("../Controller/Controller");
const BinaryMessage_1 = require("../Messages/BinaryMessage");
class ClientFactory {
    toQuery(obj) {
        return `?${Object.keys(obj)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join("&")}`;
    }
    constructor(url, controllers, params) {
        this.IsConnected = false;
        this.controllers = new Map();
        this.ws = new WebSocket(url + this.toQuery(params || {}));
        this.ws.binaryType = "arraybuffer";
        controllers.forEach((alias) => {
            this.controllers.set(alias, new Controller_1.Controller(alias, this.ws));
        });
        this.ws.onmessage = (event) => {
            if (typeof event.data !== "object") {
                const message = JSON.parse(event.data);
                this.getController(message.C).dispatch(message.T, message.D);
            }
            else {
                const message = BinaryMessage_1.BinaryMessage.fromArrayBuffer(event.data);
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
    close() {
        this.ws.close();
    }
    connectAllControllers() {
        this.controllers.forEach((controller) => controller.connect());
    }
    getController(alias) {
        return this.controllers.get(alias);
    }
    removeController(alias) {
        this.controllers.delete(alias);
    }
    onOpen(...args) { }
    onError(error) { }
    onClose(event) { }
}
exports.ClientFactory = ClientFactory;
