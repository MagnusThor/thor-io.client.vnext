export interface IContextConnection {
  context: string;
  peerId: string;
}

/**
 * Represents a connection between a context and a peer.

 * This class encapsulates information about a specific connection, 
 * including the context within which the connection exists and the ID of the peer.
 */
export class ContextConnection {
  /**
   * The context within which the connection operates. 
   */
  context: string;

  /**
   * The unique identifier of the peer involved in the connection.
   */
  peerId: string;

  /**
   * Creates a new ContextConnection instance.
 
   * @param context The context of the connection.
   * @param peerId The ID of the peer connected to the context.
   */
  constructor(context: string, peerId: string) {
    this.context = context;
    this.peerId = peerId;
  }
}