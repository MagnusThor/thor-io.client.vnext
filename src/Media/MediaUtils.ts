export class MediaUtils {
    static checkStream(tracks: Array<MediaStreamTrack>, state: string): boolean {
        return tracks.filter((t: MediaStreamTrack) => { return t.readyState === state; }) ? true : false;
    }

    static getAudioDevices(): Promise<Array<MediaDeviceInfo>> {
        return new Promise<Array<MediaDeviceInfo>>((resolve: any, reject: any) => {
            navigator.mediaDevices.enumerateDevices().then((devices: Array<MediaDeviceInfo>) => {
                resolve(devices.filter((device: MediaDeviceInfo) => device.kind === "audioinput"));
            }).catch(reject);
        });
    };

    static getVideoDevices(): Promise<Array<MediaDeviceInfo>> {
        return new Promise<Array<MediaDeviceInfo>>((resolve: any, reject: any) => {
            navigator.mediaDevices.enumerateDevices().then((devices: Array<MediaDeviceInfo>) => {
                resolve(devices.filter((device: MediaDeviceInfo) => device.kind === "videoinput"));
            }).catch(reject);
        });
    };

    static getMediaDevices(): Promise<Array<MediaDeviceInfo>> {
        return new Promise<Array<MediaDeviceInfo>>((resolve: any, reject: any) => {
            navigator.mediaDevices.enumerateDevices().then((devices: Array<MediaDeviceInfo>) => {
                resolve(devices);
            }).catch(reject);
        });
    };

    static getMediaStream(constraints: MediaStreamConstraints, cb: Function) {
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then((mediaStream: MediaStream) => {
                cb(mediaStream);
            })
            .catch((err) => {
                throw new Error(err);
            });
    }


}

