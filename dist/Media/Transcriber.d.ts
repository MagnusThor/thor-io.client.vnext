export interface IChatAIResponse {
    id: string;
    choices: [
        {
            text: string;
        }
    ];
    errors: [];
}
export declare const Transcriberlanguages: (string | string[])[][];
export declare class Transcriber {
    inputLanguage: string;
    recognition: SpeechRecognition;
    isRunning: boolean;
    onFinal: (result: string, lang: string) => void;
    onInterim: (final: string, interim: string, lang: string) => void;
    onReady: (event: any) => void;
    onStop: (event: any) => void;
    onError: (event: any) => void;
    start: () => void;
    stop: () => void;
    constructor(inputLanguage: string);
    static textToSpeech(phrase: string, lang: string): void;
    static getVoices(): Promise<Array<SpeechSynthesisVoice>>;
    static translate(text: string, from: string, to: string): string;
}
