import { Utils } from '../Utils/Utils';

/**
 * Represents a connection within the Thor.io communication framework.
 *
 * This class encapsulates information about a Thor.io connection, including its ID,
 * the underlying RTCPeerConnection object, and a unique identifier (UUID).
 */
export class ThorIOConnection {
  /**
   * The unique identifier for this connection.
   */
  id: string;

  /**
   * The underlying RTCPeerConnection object used for communication.
   */
  peerConnection: RTCPeerConnection;

  /**
   * A unique identifier (UUID) generated for this connection.
   */
  uuid: string;

  /**
   * Creates a new ThorIOConnection instance.
   *
   * @param id The ID for this connection.
   * @param rtcPeerConnection The underlying RTCPeerConnection object.
   */
  constructor(id: string, rtcPeerConnection: RTCPeerConnection) {
    this.id = id;
    this.peerConnection = rtcPeerConnection;
    this.uuid = Utils.newGuid();
  }

  /**
   * Gets the senders associated with the underlying RTCPeerConnection.
   *
   * This function retrieves an array of RTCRtpSender objects representing the RTP senders
   * on the connection.
   *
   * @returns An array of RTCRtpSender objects.
   */
  getSenders(): Array<RTCRtpSender> {
    return this.peerConnection.getSenders();
  }

  /**
   * Gets the receivers associated with the underlying RTCPeerConnection.
   *
   * This function retrieves an array of RTCRtpReceiver objects representing the RTP receivers
   * on the connection.
   *
   * @returns An array of RTCRtpReceiver objects.
   */
  getReceivers(): Array<RTCRtpReceiver> {
    return this.peerConnection.getReceivers();
  }

  /**
   * Gets the transceivers associated with the underlying RTCPeerConnection.
   *
   * This function retrieves an array of RTCRtpTransceiver objects representing the combined
   * RTP senders and receivers on the connection.
   *
   * @returns An array of RTCRtpTransceiver objects.
   */
  getTransceivers(): Array<RTCRtpTransceiver> {
    return this.peerConnection.getTransceivers();
  }
}