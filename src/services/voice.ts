import type { SupportedLanguage } from "@/types";

export const LANGUAGE_LOCALE_MAP: Record<SupportedLanguage | "English", string> = {
  Hindi: "hi-IN",
  Marathi: "mr-IN",
  Gujarati: "gu-IN",
  Tamil: "ta-IN",
  Telugu: "te-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
  Punjabi: "pa-IN",
  Bengali: "bn-IN",
  Odia: "or-IN",
  English: "en-IN"
};

export function getLangCode(language: SupportedLanguage | "English"): string {
  return LANGUAGE_LOCALE_MAP[language] || "en-IN";
}

export interface VoiceResultData {
  fullTranscript: string;
  finalTranscript: string;
  interimTranscript: string;
  isFinal: boolean;
}

export interface VoiceServiceCallbacks {
  onResult?: (data: VoiceResultData) => void;
  onListeningChange?: (listening: boolean) => void;
  onSpeakingChange?: (speaking: boolean, paused: boolean) => void;
  onError?: (error: string) => void;
  onVoicesChanged?: (voices: SpeechSynthesisVoice[]) => void;
}

export interface SpeakOptions {
  language?: SupportedLanguage | "English";
  rate?: number;
  pitch?: number;
  voiceName?: string;
}

export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private shouldListen = false;
  private currentLanguage: SupportedLanguage | "English" = "English";
  private callbacks: VoiceServiceCallbacks = {};
  private restartTimeout: ReturnType<typeof setTimeout> | null = null;

  // Speech-to-text transcript management
  private baseText = "";
  private sessionFinalTranscript = "";

  constructor(callbacks: VoiceServiceCallbacks = {}) {
    this.callbacks = callbacks;
    this.initVoices();
  }

  public setCallbacks(callbacks: VoiceServiceCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  public setBaseText(text: string) {
    this.baseText = text.trim();
    this.sessionFinalTranscript = "";
  }

  public getBaseText(): string {
    return this.baseText;
  }

  public isRecognitionSupported(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public isSynthesisSupported(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(window.speechSynthesis);
  }

  public setLanguage(language: SupportedLanguage | "English") {
    this.currentLanguage = language;
    if (this.recognition) {
      this.recognition.lang = getLangCode(language);
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.isSynthesisSupported()) return [];
    return window.speechSynthesis.getVoices() || [];
  }

  public findBestVoice(language: SupportedLanguage | "English", preferredVoiceName = ""): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (!voices.length) return null;

    if (preferredVoiceName) {
      const preferred = voices.find((v) => v.name.toLowerCase() === preferredVoiceName.toLowerCase());
      if (preferred) return preferred;
    }

    const targetLang = getLangCode(language);
    const primaryCode = targetLang.split("-")[0].toLowerCase();

    // Exact match (e.g. hi-IN)
    let matched = voices.find((v) => v.lang.replace("_", "-").toLowerCase() === targetLang.toLowerCase());
    if (matched) return matched;

    // Language prefix match (e.g. hi)
    matched = voices.find((v) => v.lang.toLowerCase().startsWith(primaryCode));
    if (matched) return matched;

    // Fallback to Indian English or US English
    matched = voices.find((v) => v.lang.replace("_", "-").toLowerCase() === "en-in") ||
              voices.find((v) => v.lang.toLowerCase().startsWith("en"));

    return matched || voices[0] || null;
  }

  public startListening(language?: SupportedLanguage | "English", initialText = "") {
    if (language) {
      this.setLanguage(language);
    }

    if (!this.isRecognitionSupported()) {
      this.emitError("Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Brave.");
      return;
    }

    this.shouldListen = true;
    if (initialText !== undefined) {
      this.baseText = initialText.trim();
    }
    this.sessionFinalTranscript = "";

    if (process.env.NODE_ENV === "development") {
      console.log("[SpeechRecognition] Recognition start requested", {
        language: this.currentLanguage,
        baseText: this.baseText
      });
    }

    if (!this.recognition) {
      const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionCtor) return;

      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLangCode(this.currentLanguage);

      recognition.onstart = () => {
        if (process.env.NODE_ENV === "development") {
          console.log("[SpeechRecognition] Recognition started");
        }
        this.emitListeningChange(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const res = event.results[i];
          if (res && res[0]) {
            const chunk = res[0].transcript.trim();
            if (res.isFinal) {
              this.sessionFinalTranscript += (this.sessionFinalTranscript ? " " : "") + chunk;
            } else {
              interimTranscript += (interimTranscript ? " " : "") + chunk;
            }
          }
        }

        let fullTranscript = "";
        if (this.baseText) {
          fullTranscript = this.baseText;
        }
        if (this.sessionFinalTranscript) {
          fullTranscript = fullTranscript ? `${fullTranscript} ${this.sessionFinalTranscript}` : this.sessionFinalTranscript;
        }
        if (interimTranscript) {
          fullTranscript = fullTranscript ? `${fullTranscript} ${interimTranscript}` : interimTranscript;
        }

        if (process.env.NODE_ENV === "development") {
          console.log("[SpeechRecognition] Recognition result", {
            resultIndex: event.resultIndex,
            finalTranscript: this.sessionFinalTranscript,
            interimTranscript,
            fullTranscript
          });
        }

        if (this.callbacks.onResult) {
          this.callbacks.onResult({
            fullTranscript,
            finalTranscript: this.sessionFinalTranscript,
            interimTranscript,
            isFinal: Boolean(!interimTranscript)
          });
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const err = event.error;
        if (process.env.NODE_ENV === "development") {
          console.warn("[SpeechRecognition] Recognition error", { error: err, message: event.message });
        }

        if (err === "no-speech") {
          return;
        }

        if (err === "not-allowed" || err === "service-not-allowed") {
          this.shouldListen = false;
          this.emitListeningChange(false);
          this.emitError("Microphone access denied. Please grant microphone permission in your browser settings.");
          return;
        }

        if (err === "audio-capture") {
          this.shouldListen = false;
          this.emitListeningChange(false);
          this.emitError("No microphone detected. Please connect a microphone and try again.");
          return;
        }

        if (err === "network") {
          this.emitError("Network error during speech recognition. Please check your Internet connection.");
        }
      };

      recognition.onend = () => {
        if (process.env.NODE_ENV === "development") {
          console.log("[SpeechRecognition] Recognition stopped");
        }

        if (this.shouldListen) {
          if (this.sessionFinalTranscript) {
            this.baseText = this.baseText
              ? `${this.baseText} ${this.sessionFinalTranscript}`.trim()
              : this.sessionFinalTranscript.trim();
            this.sessionFinalTranscript = "";
          }

          this.clearRestartTimeout();
          this.restartTimeout = setTimeout(() => {
            if (this.shouldListen && this.recognition) {
              try {
                if (process.env.NODE_ENV === "development") {
                  console.log("[SpeechRecognition] Auto-restarting continuous recognition...");
                }
                this.recognition.start();
              } catch {
                // Ignore if already active
              }
            }
          }, 150);
        } else {
          this.emitListeningChange(false);
        }
      };

      this.recognition = recognition;
    } else {
      this.recognition.lang = getLangCode(this.currentLanguage);
    }

    try {
      this.recognition.start();
    } catch {
      // Already running
      this.emitListeningChange(true);
    }
  }

  public stopListening() {
    this.shouldListen = false;
    this.clearRestartTimeout();

    if (this.sessionFinalTranscript) {
      this.baseText = this.baseText
        ? `${this.baseText} ${this.sessionFinalTranscript}`.trim()
        : this.sessionFinalTranscript.trim();
      this.sessionFinalTranscript = "";
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignored if already stopped
      }
    }
    this.emitListeningChange(false);

    if (process.env.NODE_ENV === "development") {
      console.log("[SpeechRecognition] Manual stop completed", { baseText: this.baseText });
    }
  }

  public speak(text: string, options: SpeakOptions = {}): SpeechSynthesisUtterance | null {
    if (!this.isSynthesisSupported()) {
      this.emitError("Text-to-speech is not supported in this browser.");
      return null;
    }

    if (!text || !text.trim()) {
      this.emitError("Nothing to speak.");
      return null;
    }

    this.stopSpeech();

    const targetLang = options.language || this.currentLanguage;
    const rate = options.rate ?? 0.95;
    const pitch = options.pitch ?? 1;

    const cleanText = text
      .replace(/[*_#`~]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.max(0.5, Math.min(1.5, rate));
    utterance.pitch = Math.max(0.5, Math.min(1.5, pitch));
    utterance.lang = getLangCode(targetLang);

    const voice = this.findBestVoice(targetLang, options.voiceName);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      this.emitSpeakingChange(true, false);
    };

    utterance.onend = () => {
      this.emitSpeakingChange(false, false);
    };

    utterance.onerror = (event) => {
      this.emitSpeakingChange(false, false);
      if (event.error !== "interrupted" && event.error !== "canceled") {
        this.emitError(`Speech playback error: ${event.error}`);
      }
    };

    utterance.onpause = () => {
      this.emitSpeakingChange(true, true);
    };

    utterance.onresume = () => {
      this.emitSpeakingChange(true, false);
    };

    try {
      window.speechSynthesis.speak(utterance);
      return utterance;
    } catch {
      this.emitError("Speech playback failed.");
      return null;
    }
  }

  public pauseSpeech() {
    if (this.isSynthesisSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      this.emitSpeakingChange(true, true);
    }
  }

  public resumeSpeech() {
    if (this.isSynthesisSupported() && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.emitSpeakingChange(true, false);
    }
  }

  public stopSpeech() {
    if (this.isSynthesisSupported()) {
      window.speechSynthesis.cancel();
      this.emitSpeakingChange(false, false);
    }
  }

  public destroy() {
    this.stopListening();
    this.stopSpeech();
    if (this.recognition) {
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      try {
        this.recognition.abort();
      } catch {
        // Ignored
      }
      this.recognition = null;
    }
  }

  private initVoices() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const handleVoices = () => {
        const voices = this.getAvailableVoices();
        if (this.callbacks.onVoicesChanged) {
          this.callbacks.onVoicesChanged(voices);
        }
      };

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = handleVoices;
      }
    }
  }

  private clearRestartTimeout() {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
  }

  private emitError(message: string) {
    if (this.callbacks.onError) {
      this.callbacks.onError(message);
    }
  }

  private emitListeningChange(listening: boolean) {
    if (this.callbacks.onListeningChange) {
      this.callbacks.onListeningChange(listening);
    }
  }

  private emitSpeakingChange(speaking: boolean, paused: boolean) {
    if (this.callbacks.onSpeakingChange) {
      this.callbacks.onSpeakingChange(speaking, paused);
    }
  }
}
