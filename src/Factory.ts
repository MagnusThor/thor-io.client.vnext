import { BinaryMessage } from "./Messages/BinaryMessage";
import { Proxy } from "./Proxy";
export class Factory {
    private ws: WebSocket;
    private toQuery(obj: any) {
        return `?${Object.keys(obj).map(key => (encodeURIComponent(key) + "=" +
            encodeURIComponent(obj[key]))).join("&")}`;
    }
    private proxys: Array<Proxy>;
    public IsConnected: boolean;
    constructor(private url: string, controllers: Array<string>, params?: any) {
        this.proxys = new Array<Proxy>();
        this.ws = new WebSocket(url + this.toQuery(params || {}));
        this.ws.binaryType = "arraybuffer";
        controllers.forEach(alias => {
            this.proxys.push(new Proxy(alias, this.ws));
        });
        this.ws.onmessage = event => {
            if (typeof (event.data) !== "object") {
                let message = JSON.parse(event.data);
                this.GetProxy(message.C).Dispatch(message.T, message.D);
            }
            else {
                let message = BinaryMessage.fromArrayBuffer(event.data);
                this.GetProxy(message.C).Dispatch(message.T, message.D, message.B);
            }
        };
        this.ws.onclose = event => {
            this.IsConnected = false;
            this.OnClose.apply(this, [event]);
        };
        this.ws.onerror = error => {
            this.OnError.apply(this, [error]);
        };
        this.ws.onopen = event => {
            this.IsConnected = true;
            this.OnOpen.apply(this, this.proxys);
        };
    }
    Close() {
        this.ws.close();
    }
    ;
    GetProxy(alias: string): Proxy {
        let channel = this.proxys.find(pre => (pre.alias === alias));
        return channel;
    }
    ;
    RemoveProxy(alias: string) {
        var index = this.proxys.indexOf(this.GetProxy(alias));
        this.proxys.splice(index, 1);
    }
    OnOpen(proxys: any) { }
    ;
    OnError(error: any) { }
    OnClose(event: any) { }
}
