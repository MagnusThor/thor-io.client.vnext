export declare class MediaUtils {
    static checkStream(tracks: Array<MediaStreamTrack>, state: string): boolean;
    static getAudioDevices(): Promise<Array<MediaDeviceInfo>>;
    static getVideoDevices(): Promise<Array<MediaDeviceInfo>>;
    static getMediaDevices(): Promise<Array<MediaDeviceInfo>>;
    static getMediaStream(constraints: MediaStreamConstraints, cb: Function): void;
}
