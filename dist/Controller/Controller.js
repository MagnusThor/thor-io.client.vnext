"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const Listener_1 = require("../Events/Listener");
const TextMessage_1 = require("../Messages/TextMessage");
class Controller {
    constructor(alias, ws) {
        this.alias = alias;
        this.ws = ws;
        this.listeners = new Map();
        this.isConnected = false;
        this.on("___error", (err) => {
            this.onError(err);
        });
    }
    onError(event) { }
    onOpen(event) { }
    onClose(event) { }
    connect() {
        this.ws.send(new TextMessage_1.TextMessage("___connect", {}, this.alias, null, null, true).toString());
        return this;
    }
    ;
    close() {
        this.ws.send(new TextMessage_1.TextMessage("___close", {}, this.alias, null, null, true).toString());
        return this;
    }
    ;
    subscribe(topic, fn) {
        this.ws.send(new TextMessage_1.TextMessage("___subscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
        return this.on(topic, fn);
    }
    unsubscribe(topic) {
        this.ws.send(new TextMessage_1.TextMessage("___unsubscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
    }
    on(topic, fn) {
        let listener = new Listener_1.Listener(topic, fn);
        this.listeners.set(topic, listener);
        return listener;
    }
    of(topic) {
        this.listeners.delete(topic);
    }
    findListener(topic) {
        return this.listeners.get(topic);
    }
    invokeBinary(buffer) {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by BinaryMessage");
        }
    }
    publishBinary(buffer) {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    }
    invoke(method, data, controller) {
        this.ws.send(new TextMessage_1.TextMessage(method, data, controller || this.alias, null, null, true).toString());
        return this;
    }
    publish(topic, data, controller) {
        this.invoke(topic, data, controller || this.alias);
        return this;
    }
    setProperty(propName, propValue, controller) {
        this.invoke(propName, propValue, controller || this.alias);
        return this;
    }
    dispatch(topic, data, buffer) {
        if (topic === "___open") {
            this.isConnected = true;
            this.onOpen(JSON.parse(data));
            return;
        }
        else if (topic === "___close") {
            this.onClose([JSON.parse(data)]);
            this.isConnected = false;
        }
        else {
            const listener = this.findListener(topic);
            if (listener)
                listener.action(JSON.parse(data), buffer);
        }
    }
}
exports.Controller = Controller;
