
declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: typeof webkitSpeechRecognition;


export interface IChatAIResponse {
    id: string
    choices: [{
        text: string;
    }],
    errors: []
}


export const Transcriberlanguages =
    [
        ['Afrikaans', ['af-ZA']],
        ['Bahasa Indonesia', ['id-ID']],
        ['Bahasa Melayu', ['ms-MY']],
        ['Català', ['ca-ES']],
        ['Čeština', ['cs-CZ']],
        ['Deutsch', ['de-DE']],
        ['English', ['en-AU', 'Australia'],
            ['en-CA', 'Canada'],
            ['en-IN', 'India'],
            ['en-NZ', 'New Zealand'],
            ['en-ZA', 'South Africa'],
            ['en-GB', 'United Kingdom'],
            ['en-US', 'United States']],
        ['Español', ['es-AR', 'Argentina'],
            ['es-BO', 'Bolivia'],
            ['es-CL', 'Chile'],
            ['es-CO', 'Colombia'],
            ['es-CR', 'Costa Rica'],
            ['es-EC', 'Ecuador'],
            ['es-SV', 'El Salvador'],
            ['es-ES', 'España'],
            ['es-US', 'Estados Unidos'],
            ['es-GT', 'Guatemala'],
            ['es-HN', 'Honduras'],
            ['es-MX', 'México'],
            ['es-NI', 'Nicaragua'],
            ['es-PA', 'Panamá'],
            ['es-PY', 'Paraguay'],
            ['es-PE', 'Perú'],
            ['es-PR', 'Puerto Rico'],
            ['es-DO', 'República Dominicana'],
            ['es-UY', 'Uruguay'],
            ['es-VE', 'Venezuela']],
        ['Euskara', ['eu-ES']],
        ['Français', ['fr-FR']],
        ['Galego', ['gl-ES']],
        ['Hrvatski', ['hr_HR']],
        ['IsiZulu', ['zu-ZA']],
        ['Íslenska', ['is-IS']],
        ['Italiano', ['it-IT', 'Italia'],
            ['it-CH', 'Svizzera']],
        ['Magyar', ['hu-HU']],
        ['Nederlands', ['nl-NL']],
        ['Norsk bokmål', ['nb-NO']],
        ['Polski', ['pl-PL']],
        ['Português', ['pt-BR', 'Brasil'],
            ['pt-PT', 'Portugal']],
        ['Română', ['ro-RO']],
        ['Slovenčina', ['sk-SK']],
        ['Suomi', ['fi-FI']],
        ['Svenska', ['sv-SE']],
        ['Türkçe', ['tr-TR']],
        ['български', ['bg-BG']],
        ['Pусский', ['ru-RU']],
        ['Српски', ['sr-RS']],
        ['한국어', ['ko-KR']],
        ['中文', ['zh-CN', '普通话 (中国大陆)'],
            ['zh-HK', '普通话 (香港)'],
            ['zh-TW', '中文 (台灣)'],
            ['zh-HK', '粵語 (香港)']],
        ['日本語', ['ja-JP']],
        ['Lingua latīna', ['la']]];


export class Transcriber {

    recognition: SpeechRecognition;
    isRunning: boolean = false;

    onFinal: (result: string, lang: string) => void = () => { };
    onInterim: (final: string, interim: string, lang: string) => void = () => { };

    onReady: (event: any) => void = () => { };
    onStop: (event: any) => void = () => { };
    onError: (event: any) => void = () => { };
    start: () => void;
    stop: () => void;


    constructor(public inputLanguage: string) {

        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        if (this.inputLanguage) {
            this.recognition.lang = inputLanguage;
        }
        this.recognition.onspeechend = (event: any) => {
            if (this.isRunning) this.onStop(event);
            this.isRunning = false;
        }

        this.recognition.onspeechstart = (ev: Event) => {
            console.log("Speech started", ev);
        }
        this.recognition.onaudiostart = (ev: Event) => {
            console.log("Audio started", ev);
            
        }

        this.recognition.onaudioend = (ev: Event) => {
            console.log("Audion Ended", ev);
        }

        this.recognition.onend = (event: any) => {
            if (this.isRunning) this.onStop(event);
            this.isRunning = false;
        }
        this.recognition.onerror = (event: any) => {
            if (this.onError) this.onError(event);
        }
        this.recognition.onstart = () => {
            this.isRunning = true;
        }
        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = '';
            let final = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final += event.results[i][0].transcript;
                } else {
                    interim += event.results[i][0].transcript;
                }
            }
            if (final.length > 0 && this.onFinal) {
                if (this.onInterim)
                    this.onInterim(interim, final, this.inputLanguage)

                this.onFinal(final, this.inputLanguage)
            }
            if (interim.length > 0 && this.onInterim) {
                this.onInterim(interim, final, this.inputLanguage)
            }
        };


        this.stop = () => {
            if (this.isRunning) {
                this.isRunning = false;
                this.recognition.stop();
                this.onStop(event);
            }
        };
        this.start = () => {
            if (!this.isRunning) {
                this.recognition.start();
            }
        };
        if (this.onReady) this.onReady(this);
    }


    static textToSpeech(phrase: string, lang: string) {
        const chooseVoice = async (l: string) => {
            const voice = (await this.getVoices()).find(voice => voice.lang == l)
            return new Promise<SpeechSynthesisVoice>(resolve => {
                resolve(voice!)
            })
        }
        const message = new SpeechSynthesisUtterance(phrase)
        chooseVoice(lang).then((v: SpeechSynthesisVoice) => {
            if (v) message.voice = v;
            speechSynthesis.speak(message)
        });
    }

    static getVoices(): Promise<Array<SpeechSynthesisVoice>> {
        return new Promise<Array<SpeechSynthesisVoice>>((resolve) => {
            let voices = speechSynthesis.getVoices()
            if (voices.length) {
                resolve(voices)
                return
            }
            const voiceschanged = () => {
                voices = speechSynthesis.getVoices();
                resolve(voices)
                speechSynthesis.onvoiceschanged = voiceschanged
            }
        });
    }


    static translate(text: string, from: string, to: string) {
        const prompt = `Translate "${text}" from ${from} to ${to}.`;
        return prompt;;
    }





}

