import { TextMessage } from "./Messages/TextMessage";
import { Listener } from "./Listener";
export class Proxy {
    IsConnected: boolean;
    private listeners: Array<Listener>;
    constructor(public alias: string, private ws: WebSocket) {
        this.listeners = new Array<Listener>();
        this.IsConnected = false;
        this.On("___error", (err: any) => {
            this.OnError(err);
        });
    }
    OnError(event: any) { }
    OnOpen(event: any) { }
    OnClose(event: any) { }
    Connect() {
        this.ws.send(new TextMessage("___connect", {}, this.alias).toString());
        return this;
    }
    ;
    Close() {
        this.ws.send(new TextMessage("___close", {}, this.alias).toString());
        return this;
    }
    ;
    Subscribe(topic: string, callback: any): Listener {
        this.ws.send(new TextMessage("___subscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
        return this.On(topic, callback);
    }
    ;
    Unsubscribe(topic: string) {
        this.ws.send(new TextMessage("___unsubscribe", {
            topic: topic,
            controller: this.alias
        }, this.alias).toString());
    }
    ;
    On(topic: string, fn: any): Listener {
        var listener = new Listener(topic, fn);
        this.listeners.push(listener);
        return listener;
    }
    ;
    private findListener(topic: string): Listener {
        let listener = this.listeners.find((pre: Listener) => {
            return pre.topic === topic;
        });
        return listener;
    }
    Off(topic: string) {
        let index = this.listeners.indexOf(this.findListener(topic));
        if (index >= 0)
            this.listeners.splice(index, 1);
    }
    ;
    InvokeBinary(buffer: ArrayBuffer): Proxy {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    }
    PublishBinary(buffer: ArrayBuffer): Proxy {
        if (buffer instanceof ArrayBuffer) {
            this.ws.send(buffer);
            return this;
        }
        else {
            throw ("parameter provided must be an ArrayBuffer constructed by Client.BinaryMessage");
        }
    }
    Invoke(topic: string, data: any, controller?: string): Proxy {
        this.ws.send(new TextMessage(topic, data, controller || this.alias).toString());
        return this;
    }
    ;
    Publish(topic: string, data: any, controller?: string): Proxy {
        this.ws.send(new TextMessage(topic, data, controller || this.alias).toString());
        return this;
    }
    ;
    SetProperty(propName: string, propValue: any, controller?: string): Proxy {
        this.Invoke(propName, propValue, controller || this.alias);
        return this;
    }
    ;
    public Dispatch(topic: string, data: any, buffer?: ArrayBuffer | Uint8Array) {
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
    ;
}
