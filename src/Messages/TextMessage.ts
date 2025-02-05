import { Utils } from '../Utils/Utils';
import { BinaryMessage } from './BinaryMessage';

/**
 * Thor.io TextMessage
 *
 * @export
 * @class TextMessage
 */
export class TextMessage {
  /** 
   * Binary data associated with the message. 
   * Can be an ArrayBuffer or Uint8Array.
   */
  B?: ArrayBuffer | Uint8Array;

  /** Topic of the message. */
  T: string;

  /** Data payload of the message. */
  D: any;

  /** Controller associated with the message. */
  C: string;

  /** Unique identifier for the message. */
  I: string;

  /** Flag indicating if this is the final message in a sequence. */
  F?: boolean;

  /** 
   * Converts the TextMessage object to a JSON representation. 
   * 
   * @returns The JSON representation of the TextMessage.
   */
  toJSON(): any {
    return {
      T: this.T,
      D: JSON.stringify(this.D), 
      C: this.C,
      I: this.I,
      F: this.F,
    };
  }

  /**
   * Creates a new TextMessage instance.
   * 
   * @param topic The topic of the message.
   * @param object The data payload of the message.
   * @param controller The controller associated with the message.
   * @param buffer Optional binary data associated with the message.
   * @param uuid Optional unique identifier for the message.
   * @param isFinal Optional flag indicating if this is the final message in a sequence.
   */
  constructor(
    topic: string,
    object: any,
    controller: string,
    buffer?: ArrayBuffer | Uint8Array,
    uuid?: string,
    isFinal?: boolean
  ) {
    this.D = object;
    this.T = topic;
    this.C = controller;
    this.B = buffer;
    this.I = uuid || Utils.newGuid();
    this.F = isFinal;
  }

  /**
   * Converts the TextMessage to a string representation (JSON.stringify).
   * 
   * @returns The string representation of the TextMessage.
   */
  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  /**
   * Creates a TextMessage instance from an ArrayBuffer.
   * 
   * @param buffer The ArrayBuffer containing the serialized TextMessage.
   * @returns The deserialized TextMessage object.
   */
  static fromArrayBuffer(buffer: ArrayBuffer): TextMessage {
    return BinaryMessage.fromArrayBuffer(buffer); 
  }
}