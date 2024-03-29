"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
class Recorder {
    constructor(stream, mimeType, ignoreMutedMedia) {
        this.stream = stream;
        this.mimeType = mimeType;
        this.ignoreMutedMedia = ignoreMutedMedia;
        this.recorder = new exports.MediaRecorder(stream, { mimeType: mimeType, ignoreMutedMedia: ignoreMutedMedia });
        this.recorder.onstop = (event) => {
            this.handleStop(event);
        };
        this.recorder.ondataavailable = (event) => {
            this.handleDataAvailable(event);
        };
    }
    handleStop(event) {
        this.IsRecording = false;
        let blob = new Blob(this.blobs, { type: this.mimeType });
        this.OnRecordComplated.apply(event, [blob, URL.createObjectURL(blob)]);
    }
    OnRecordComplated(blob, blobUrl) { }
    handleDataAvailable(event) {
        if (event.data.size > 0) {
            this.blobs.push(event.data);
        }
    }
    IsTypeSupported(type) {
        throw "not yet implemented";
    }
    getStats() {
        return {
            videoBitsPerSecond: this.recorder.videoBitsPerSecond,
            audioBitsPerSecond: this.recorder.audioBitsPerSecond
        };
    }
    stop() {
        this.recorder.stop();
    }
    start(ms) {
        this.blobs = new Array();
        if (this.IsRecording) {
            this.stop();
            return;
        }
        this.blobs.length = 0;
        this.IsRecording = true;
        this.recorder.start(ms || 100);
    }
}
exports.Recorder = Recorder;
