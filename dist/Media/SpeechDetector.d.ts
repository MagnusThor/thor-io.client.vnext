export declare class SpeechDetector {
    mediaStream: MediaStream;
    minDecibel: number;
    historySize: number;
    audioContext: AudioContext;
    mediaStreamSource: MediaStreamAudioSourceNode;
    processor: ScriptProcessorNode;
    ondataavailable: ((rms: number) => void) | undefined;
    onspeechstarted: ((rms: number) => void) | undefined;
    onspeechended: ((rms: number) => void) | undefined;
    history: Array<number> | undefined;
    private _interval;
    isSpeaking: boolean;
    avg: (arr: Array<number>) => number;
    constructor(mediaStream: MediaStream, minDecibel: number, historySize: number);
    start(n: number): void;
    stop(): void;
}
