"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
class Recorder {
    constructor(stream, mimeType) {
        this.stream = stream;
        this.mimeType = mimeType;
        this.blobs = [];
        this.IsRecording = false;
        try {
            this.recorder = new MediaRecorder(stream, { mimeType: mimeType });
            this.recorder.onstop = this.handleStop.bind(this);
            this.recorder.ondataavailable = this.handleDataAvailable.bind(this);
        }
        catch (error) {
            console.error("Error creating MediaRecorder:", error);
        }
    }
    handleStop(event) {
        this.IsRecording = false;
        const blob = new Blob(this.blobs, { type: this.mimeType });
        if (this.OnRecordComplated) {
            this.OnRecordComplated(blob, URL.createObjectURL(blob));
        }
    }
    handleDataAvailable(event) {
        if (event.data.size > 0) {
            this.blobs.push(event.data);
        }
    }
    IsTypeSupported(type) {
        return MediaRecorder.isTypeSupported(type);
    }
    getStats() {
        return {
            videoBitsPerSecond: this.recorder.videoBitsPerSecond,
            audioBitsPerSecond: this.recorder.audioBitsPerSecond,
        };
    }
    stop() {
        this.recorder.stop();
    }
    start(ms = 100) {
        this.blobs = [];
        if (this.IsRecording) {
            this.stop();
            return;
        }
        this.IsRecording = true;
        this.recorder.start(ms);
    }
}
exports.Recorder = Recorder;
