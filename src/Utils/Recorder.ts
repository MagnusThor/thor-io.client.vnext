/**
 * A class for recording media streams.
 *
 * This class provides functionality to record a MediaStream with specified options
 * and handle recording events.
 */
export class Recorder {
    /** The underlying MediaRecorder instance used for recording. */
    private recorder: any;
  
    /** An array of Blobs containing the recorded media data. */
    private blobs: Blob[] = [];
  
    /** A flag indicating if the recorder is currently recording. */
    public IsRecording: boolean = false;
  
    /**
     * Creates a new Recorder instance.
     *
     * @param stream The MediaStream to be recorded.
     * @param mimeType The desired MIME type of the recorded media (e.g., "video/webm").
     * @param ignoreMutedMedia A flag indicating whether to ignore muted media tracks (default: false).
     */
    constructor(private stream: MediaStream, private mimeType: string) {
      try {
        this.recorder = new MediaRecorder(stream, { mimeType: mimeType });
        this.recorder.onstop = this.handleStop.bind(this); // Use bind for event listener
        this.recorder.ondataavailable = this.handleDataAvailable.bind(this);
      } catch (error) {
        console.error("Error creating MediaRecorder:", error);
      }
    }
  
    /**
     * Handles the "stop" event from the MediaRecorder.
     *
     * This function is called when the recording is stopped. It finalizes the recording
     * by creating a Blob from the recorded data and calls the optional `OnRecordComplated` callback.
     *
     * @param event The "stop" event object from the MediaRecorder.
     */
    private handleStop(event: any) {
      this.IsRecording = false;
      const blob = new Blob(this.blobs, { type: this.mimeType });
      if (this.OnRecordComplated) { // Check if callback exists
        this.OnRecordComplated(blob, URL.createObjectURL(blob));
      }
    }
  
    /**
     * Optional callback function called when recording is completed.
     *
     * This callback function is provided by the user and receives the recorded Blob
     * and a URL to the recorded data as arguments.
     *
     * @param blob The Blob containing the recorded media data.
     * @param blobUrl A URL to access the recorded media data.
     */
    public OnRecordComplated?(blob: Blob, blobUrl: string): void;
  
    /**
     * Handles the "dataavailable" event from the MediaRecorder.
     *
     * This function is called when new data becomes available during recording.
     * It checks if the data size is greater than zero and then pushes the data to the `blobs` array.
     *
     * @param event The "dataavailable" event object from the MediaRecorder.
     */
    private handleDataAvailable(event: any) {
      if (event.data.size > 0) {
        this.blobs.push(event.data);
      }
    }
  
    /**
     * Checks if a specified media type is supported for recording.
     *
     * This function uses the `MediaRecorder.isTypeSupported` static method to check
     * if the provided media type can be recorded by the browser.
     *
     * @param type The media type to check for support (e.g., "video/webm").
     * @returns True if the media type is supported, false otherwise.
     */
    public IsTypeSupported(type: string): boolean {
      return MediaRecorder.isTypeSupported(type);
    }
  
    /**
     * Gets statistics about the current recording.
     *
     * This function retrieves statistics from the underlying MediaRecorder instance,
     * including video and audio bitrates.
     *
     * @returns An object containing recording statistics.
     */
    public getStats(): any {
      return {
        videoBitsPerSecond: this.recorder.videoBitsPerSecond,
        audioBitsPerSecond: this.recorder.audioBitsPerSecond,
      };
    }
  
    /**
     * Stops the ongoing recording.
     *
     * This function calls the `stop` method on the underlying MediaRecorder instance
     * to stop the recording process.
     */
    public stop() {
      this.recorder.stop();
    }
  public start(ms: number = 100) {
    this.blobs = [];
    if (this.IsRecording) {
      this.stop();
      return;
    }
    this.IsRecording = true;
    this.recorder.start(ms);
  }
}