export declare var MediaRecorder: any;
export declare class Recorder {
    private stream;
    private mimeType;
    private ignoreMutedMedia;
    private recorder;
    private blobs;
    IsRecording: boolean;
    constructor(stream: MediaStream, mimeType: string, ignoreMutedMedia: boolean);
    private handleStop;
    OnRecordComplated(blob: any, blobUrl: string): void;
    private handleDataAvailable;
    IsTypeSupported(type: string): void;
    GetStats(): any;
    Stop(): void;
    Start(ms: number): void;
}
