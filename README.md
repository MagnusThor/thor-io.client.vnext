# ThorIOClient

ThorIOClient gives you the tools to connect, use and take advantage of the power that thor-io.vnext brings when 
it comes to simplify real-time communication in your web, native and IoT applications. It covers RPC, PubSub,P2P and MediaStream's in a
 statefull,low-latency, bi-directional environment/world.


## Installation

    npm install thor-io.client-vnext  

## ThorIOClient.Factory

You will need a `ThorIOClient.Factory` when connecting to a ThorIO.Engine (server) and the ThorIO.Controllers you have provided/registered.   The factory is simple in itself. It just opens the connection to the endpoints and controllers and provides a `ThorIOClient.Proxy` for each `ThorIO.Controller`.


## .Factory(url:string,controllers:Array[string],?params:any): ThorIOClient.Factory

To connect to a ThorIO.Engine you need to create a client using the `.Factory` 

    let factory = ThorIOClient.Factory("ws://localhost:1337", ["foo"]);

The array of controllers corresponds to the alias defined by using the `@ControllerProperties(..)` decorator on the ThorIO.Controllers registered at the server side ( see Engine & Controller ).  Each controller (alias) must correspond to the alias of the Controller.


## Events

### OnOpen(a:ThorIOClient.Proxy,b:ThorIOClient.Proxy...) 

When the connection to the endpoint specified (using `.Factory`) is established, the `OnOpen` event will fire and pass 1-n `ThorIOClient.Proxy` based on the Controllers specified.  
 

> A ThorIOClient.Proxy instance must not be mixed up with a ThorIO.Controller (server). 


     let factory = new ThorIOClient.Factory("ws://localhost:1337", ["foo","bar"]);
        factory.onopen =>(foo:ThorIOClient.Proxy,bar:ThorIOClient.Proxy) {   

          foo.Connect(); 
          bar.Connect();

	}


The `ThorIOClient.Proxy`  are a key feature that you need to study. 

### OnClose(event:Event)

This fires when the connection to the endpoint disconnects.

    factory.OnClose = (evt:Event) => {
  		 // do-op
    };

### OnError(err:any)

This fires when an error occurs on the ThorIO.Engine ( server side)

       factory.OnError = (err:any) => {
  		 // do-op
	    };

## Methods

### GetProxy(alias:string) : ThorIOClient.Proxy

To get a registered on a factory



### RemoveProxy(alias:string):void

This removes the registered proxy.

### Close() : void

This closes the client connection to the endpoint. Will close all `ThorIOClient.Proxy` instances created. 

### Reconnect()

TBD

## Properties


### IsConnected: boolean

Indicates if the factory is has an established connection.


# ThorIOClient.Proxy

The concept of `ThorIOClient.Proxy` can briefly be described as follows.
A proxy can be considered as a client instance of the `ThorIO.Controller.` 
When a client connects to the Engine and the specified controller, the server will create an instance of the controller and establish a proxy to the client.

Let's say that you have a ThorIO.Controller named "foo" hosted on localhost:1337. Then we would create clients connection using the 
`.Factory`

    let factory = ThorIOC.lient.Factory("ws://localhost:1337", ["foo","bar"]);

The `.Factory` will then fire the `.OnOpen` event and provide you with 1-n many proxies. Depending on the number of controllers aliases specified, in this case `["foo","bar"]`, The Factory will then give us proxies to "`foo`" and one for "`bar`"

     factory.OnOpen = (foo:ThorIO.Client.Proxy,bar:ThorIO.Client.Proxy) => {
        foo.Connect();
        // do other ops...
     };

## Events

### OnOpen(Event) 

When the Engine is successfully created the `ThorIOClient.Proxy` will send back an object the includes `ConnectionInfo`

Where foo is the Channel (see above)

      foo.OnOpen = (clietInfo:any) => {
                // do op's
      };

Note that `.Connect` will need to be called first (see below )

### OnClose(Event)

This fires when the `ThorIO.Controllers` call `.Close` or the client calls `.Close`

### OnError(Error)

Fires when an error occurs.

## Methods

### Connect()

When the ThorIOClient.Proxy is created using the .Factory(...), you need to call `.Connect`() to be able to use it. 
When `.Connect` is called the `OnOpen` event will fire if the connection is successfully established.

### Close()

This closes the channel and removes the `ThorIO.Controller` instance on the server. `Close()` will fire the `OnClose` event.

### SetProperty(propName: string, propValue: any, controller?: string): ThorIO.Client.Proxy;

To set a property on a `ThorIO.Controller` instance invoke the method SetProperty. Note that the
property on the `ThorIO.Controller` of yours must have use the Decorator @CanSet(true)



    myProxy.SetProperty("age",11);


Where the `ThorIO.Controller` has a property named ages as follows

    ..
    CanSet(true)
    public: age: number 
    ..


## RPC & PubSub patterns

ThorIO supports two different communication patterns - RPC and Publish & Subscribe. See sections below.


## RPC Pattern

One of the communication patterns of ThorIO is the RPC pattern.  If you choose to adopt the RPC pattern you use `invoke`, `invokeToAll` and `invokeTo` methods to invoke/call methods on your ThorIO.Controller.  ( note this relates to the Controller )

 To add and remove listeners on the client use `On` and `Off` . As you can pass an expression or filter on a state declared by each client connected, you are able to target specific clients based on state, so the implementation of RPC in ThorIO can be considered as an extension of RPC.


### Invoke(topic: string, data: any, controller?: string): ThorIOClient.Proxy;

 To invoke / call a method on ThorIO.Controller use `.invoke`, where `topic` is the name of the method and data is the arguments/parameters.

Let's say that the `ThorIO.Controller` (server) has a method named "`say`". Then we would do the following on our `ThorIO.Client.Proxy`

     foo.Invoke("say", { message: this.value, created: new Date() });

### InvokeBinary(buffer: ArrayBuffer): ThorIOClient.Proxy;

Sends a message to the `ThorIO.Controller` as an ArrayBuffer.  ThorIO expects the ArrayBuffer that you send to be in the 
ThorIOClient.BinaryMessage format. See Thor.BinaryMessage for information.


   
### On(topic: string, fn: any): Listener;

To add a listener for a topic on the ThorIO.Client.Proxy

      foo.On("say",(message:any) => {
          // do stuff with the message recieved 
		  // from the server controller 
     });

### Off(topic: string): void;

To remove a listener (stop receiving messages)

    foo.Off("say");  // will not deal with the topic anymore...


## Publish & Subscribe (PubSub) pattern

In addition to the RPC pattern mentioned above you can use a publish & subscribe pattern.  The publish & subscribe pattern of ThorIO is similar to the RPC implementation, but the main difference is that the ThorIO controller always ensures that the specific client connected has a valid subscription before sending the information. 

### Subscribe(topic: string, callback: Function): Listener;

To establish / register a subscription on the channel, call subscribe. This will notify the server (controller) that the client subscribes to the specified topic.

    foo.Subscribe("news", (data:any) => {
		// do ops with the data when the server publishes....
    });

### Unsubscribe(topic: string): void;

To remove / unsubscribe an subscription, call unsubscribe. This will remove the subscription from the `ThorIO.Controller` and the `ThorIO.Client.Proxy`


### Publish(topic: string, data: any, controller?: string): ThorIOClient.Proxy

To publish a message (data) you call the publish method. 

### PublishBinary(buffer: ArrayBuffer): ThorIOClient.Proxy;


Publishes a message to the `ThorIO.Controller` as an ArrayBuffer.  ThorIO expects the ArrayBuffer that you send to be in the 
ThorIOClient.BinaryMessage format. See Thor.BinaryMessage for information.


## ThorIOClient.Message

When you call invoke, publish etc. on a ThorIOClient.Proxy the API constructs a `ThorIOClient.Message`.


### ThorIOClient.Message(topic: string, object: any, controller: string, buffer?: ArrayBuffer): ThorIOClient.Message

## Methods

### toJSON:object

### toString()

Get the message serialized as a string

### static fromArrayBuffer(buffer: ArrayBuffer): any; 

Convert an ArrayBuffer of `ThorIOClient.BinaryMessage` to an `ThorIOClient.Message`

## Properties

### D:object

the data object of the message

### T:string

the message's topic

### C:string

name of the `ThorIO.Controller` that the message targets.

## ThorIOClient.BinaryMessage

`ThorIOClient.BinaryMessage`  allows you to pass binary data such as ArrayBuffer's and Blobs from your client to the 
controller. It wrapps and constructs a BinaryMessage format designed to work with `ThorIO.Controller` .


## ThorIOClient.BinaryMessage(message:string,buffer:ArrayBuffer): ThorIOClient.BinaryMessage

To create a binary message you need to provide the `ThorIOClient.Message`  serialized as a string, and the ArrayBuffer as the second
argument.

        let message = new ThorIOClient.Message("sendMessage",
          {foo:'bar',"mycontroller"
        );
        
        let buffer = new ArrayBuffer(10);
        
        let bm = new ThorIOClient.BinaryMessage(message.toString(),buffer);


This example will invoke the "sendMessage" method on the controller named 'mycontroller', with the ArrayBuffer along with the object 
    {foo:bar}


## ThorIOClient.WebRTC


`ThorIOClient.WebRTC` wraps the browser's WebRTC implementation to provide a simple and 
 configurable, and easy-to-use peer-to-peer connection API. It's supoorts 1-n peer's 
 and lets you create a P2P data or media stream connection to the remote peers.  ThorIO as a build-in
 "peer broker" that delivers necessary functionallity signaling, negotiation and room (context) features - Everyting you 
 neet to build your WebRTC application.


### constructor(brokerProxy: ThorIOClient.Proxy, rtcConfig: any): ThorIOClient.WebRTC

Creates an instance of the WebRTC wrapper and connects to the broker ( ThorIOClient.Proxy )

## Methods


### AddLocalStream(stream: MediaStream):void

Adds a MediaStream to the clients 'local' PeerConnection.


### AddIceServer(iceServer: RTCIceServer):void

Add and RTCIceServer to the configuration.


### Connect(peerConnections: Array<PeerConnection>):void

Connect to the provided list of PeerConnection's. When call it initializes a negotiation sequence.

### Disconnect() : void

Disconnect's all PeerConnection's established to the local PeerConnection. 

### ChangeContext(context: string): void

When invoked the broker is called and the context is changed (room). Will fire the OnContextChange event on success.

### ConnectContext()

## Events

### OnError: (err: any) : void;

Fires when an error occurs.

### OnContextCreated: (peerConnection: PeerConnection);

Fires when a client connects and the broker is ready. Occurs once during the lifecycle of the WebRTC instance.
By default the broker creates a random context. Not that you can ofcourse override the default behavior of the broker 
by implemetning a custom broker.


### OnContextChanged: (context: string);

Fires after that ChangeContext is invoked and the broker confirms the change.

### OnRemoteStream: (stream: MediaStream, connection: WebRTCConnection)

Fires when a MediaStream is connected and aviilable.

### OnRemoteStreamlost: (streamId: string, peerId: string)

Fires when a remote MediaStream is lost. i.e the remote PeerConnection is lost or the steam is removed.

### OnLocalStream: (stream: MediaStream)

Fires when a local stream is added. After AddLocalStream is invoked.

### OnContextConnected: (rtcPeerConnection: RTCPeerConnection)

Fires when the 'local' PeerConnection has established a connection to a context,

### OnContextDisconnected: (rtcPeerConnection: RTCPeerConnection)

Fires when the 'local' PeerConnection disconnects from a Context.

### OnConnectTo(peerConnections: Array<PeerConnection>): void;

Fires when the broker notifies initalizes a negotiation sequence.  By default ( if not implemented ) toe WebRTC wrapper
will connnect all the peerConnections at the current context.





