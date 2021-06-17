"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoConstraints = void 0;
class VideoConstraints {
    constructor(bitrate, height) {
        this.bitrate = bitrate;
        this.height = height;
    }
    async setVideoParams(sender) {
        await sender.track.applyConstraints({ height: this.height });
    }
}
exports.VideoConstraints = VideoConstraints;
