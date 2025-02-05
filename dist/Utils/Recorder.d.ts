export declare class Recorder {
    private stream;
    private mimeType;
    private recorder;
    private blobs;
    IsRecording: boolean;
    constructor(stream: MediaStream, mimeType: string);
    private handleStop;
    OnRecordComplated?(blob: Blob, blobUrl: string): void;
    private handleDataAvailable;
    IsTypeSupported(type: string): boolean;
    getStats(): any;
    stop(): void;
    start(ms?: number): void;
}
