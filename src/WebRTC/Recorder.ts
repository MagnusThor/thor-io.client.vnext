export declare var MediaRecorder: any;



export class Recorder {
    private recorder: any;
    private blobs: Array<any>;
    public IsRecording: boolean;
    constructor(private stream: MediaStream, private mimeType: string,private ignoreMutedMedia:boolean) {
        this.recorder = new MediaRecorder(stream, { mimeType: mimeType, ignoreMutedMedia: ignoreMutedMedia });
        this.recorder.onstop = (event:any) => {
            this.handleStop(event);
        };
        this.recorder.ondataavailable = (event:any) => {
            this.handleDataAvailable(event);
        };
    }
    private handleStop(event: any) {
        this.IsRecording = false;
        let blob = new Blob(this.blobs, { type: this.mimeType });
        this.OnRecordComplated.apply(event, [blob, URL.createObjectURL(blob)]);
    }
    public OnRecordComplated(blob: any, blobUrl: string) { }
    private handleDataAvailable(event: any) {
        if (event.data.size > 0) {
            this.blobs.push(event.data);
        }
    }
    IsTypeSupported(type: string) {
        throw "not yet implemented";
    }
    GetStats(): any {
        return {
            videoBitsPerSecond: this.recorder.videoBitsPerSecond,
            audioBitsPerSecond: this.recorder.audioBitsPerSecond
        };
    }
    Stop() {
        this.recorder.stop();
    }
    Start(ms: number) {
        this.blobs = new Array<any>();
        if (this.IsRecording) {
            this.Stop();
            return;
        }
        this.blobs.length = 0;
        this.IsRecording = true;
        this.recorder.start(ms || 100);
    }
}
