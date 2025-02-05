/**
 * Represents a data channel within a peer-to-peer connection.

 * This class encapsulates information about a specific data channel, 
 * including its associated peer ID, the underlying RTCDataChannel object, 
 * and a descriptive label.
 */
export class PeerChannel {
    /**
     * The ID of the peer associated with this data channel.
     */
    peerId: string;
  
    /**
     * The underlying RTCDataChannel object for this connection.
     */
    dataChannel: RTCDataChannel;
  
    /**
     * A descriptive label for this data channel.
     */
    label: string;
  
    /**
     * Creates a new PeerChannel instance.
  
     * @param peerId The ID of the peer associated with this channel.
     * @param dataChannel The underlying RTCDataChannel object.
     * @param label A descriptive label for this channel.
     */
    constructor(peerId: string, dataChannel: RTCDataChannel, label: string) {
      this.peerId = peerId;
      this.dataChannel = dataChannel;
      this.label = label;
    }
  }