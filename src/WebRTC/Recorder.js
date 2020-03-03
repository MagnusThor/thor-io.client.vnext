"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Recorder = /** @class */ (function () {
    function Recorder(stream, mimeType, ignoreMutedMedia) {
        var _this = this;
        this.stream = stream;
        this.mimeType = mimeType;
        this.ignoreMutedMedia = ignoreMutedMedia;
        this.recorder = new exports.MediaRecorder(stream, { mimeType: mimeType, ignoreMutedMedia: ignoreMutedMedia });
        this.recorder.onstop = function (event) {
            _this.handleStop(event);
        };
        this.recorder.ondataavailable = function (event) {
            _this.handleDataAvailable(event);
        };
    }
    Recorder.prototype.handleStop = function (event) {
        this.IsRecording = false;
        var blob = new Blob(this.blobs, { type: this.mimeType });
        this.OnRecordComplated.apply(event, [blob, URL.createObjectURL(blob)]);
    };
    Recorder.prototype.OnRecordComplated = function (blob, blobUrl) { };
    Recorder.prototype.handleDataAvailable = function (event) {
        if (event.data.size > 0) {
            this.blobs.push(event.data);
        }
    };
    Recorder.prototype.IsTypeSupported = function (type) {
        throw "not yet implemented";
    };
    Recorder.prototype.GetStats = function () {
        return {
            videoBitsPerSecond: this.recorder.videoBitsPerSecond,
            audioBitsPerSecond: this.recorder.audioBitsPerSecond
        };
    };
    Recorder.prototype.Stop = function () {
        this.recorder.stop();
    };
    Recorder.prototype.Start = function (ms) {
        this.blobs = new Array();
        if (this.IsRecording) {
            this.Stop();
            return;
        }
        this.blobs.length = 0;
        this.IsRecording = true;
        this.recorder.start(ms || 100);
    };
    return Recorder;
}());
exports.Recorder = Recorder;
//# sourceMappingURL=Recorder.js.map