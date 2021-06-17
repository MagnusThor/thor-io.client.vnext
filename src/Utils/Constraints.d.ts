export declare class VideoConstraints {
    bitrate: number;
    height: number;
    constructor(bitrate: number, height: number);
    setVideoParams(sender: RTCRtpSender): Promise<any>;
}
