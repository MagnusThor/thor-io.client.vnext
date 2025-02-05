"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaUtils = void 0;
class MediaUtils {
    static checkStream(tracks, state) {
        return tracks.filter((t) => { return t.readyState === state; }) ? true : false;
    }
    static getAudioDevices() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                resolve(devices.filter((device) => device.kind === "audioinput"));
            }).catch(reject);
        });
    }
    ;
    static getVideoDevices() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                resolve(devices.filter((device) => device.kind === "videoinput"));
            }).catch(reject);
        });
    }
    ;
    static getMediaDevices() {
        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                resolve(devices);
            }).catch(reject);
        });
    }
    ;
    static getMediaStream(constraints, cb) {
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((mediaStream) => {
            cb(mediaStream);
        })
            .catch((err) => {
            throw new Error(err);
        });
    }
}
exports.MediaUtils = MediaUtils;
