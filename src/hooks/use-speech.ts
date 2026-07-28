"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { VoiceService, type SpeakOptions, type VoiceResultData } from "@/services/voice";
import type { SupportedLanguage } from "@/types";

export function useSpeech(initialLanguage: SupportedLanguage | "English" = "English") {
  const [supported, setSupported] = useState(false);
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const [isSynthesisSupported, setIsSynthesisSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [transcript, setTranscriptState] = useState("");
  const [error, setError] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const voiceServiceRef = useRef<VoiceService | null>(null);
  const transcriptRef = useRef("");

  // Keep transcriptRef in sync with state for callbacks
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    const service = new VoiceService({
      onResult: (data: VoiceResultData) => {
        setTranscriptState(data.fullTranscript);
        if (process.env.NODE_ENV === "development") {
          console.log("[SpeechRecognition] State updated", {
            fullTranscript: data.fullTranscript,
            finalTranscript: data.finalTranscript,
            interimTranscript: data.interimTranscript,
            isFinal: data.isFinal
          });
        }
      },
      onListeningChange: (isListening) => {
        setListening(isListening);
      },
      onSpeakingChange: (isSpeaking, isPaused) => {
        setSpeaking(isSpeaking);
        setPaused(isPaused);
      },
      onError: (errMsg) => {
        setError(errMsg);
      },
      onVoicesChanged: (availableVoices) => {
        setVoices(availableVoices);
      }
    });

    service.setLanguage(initialLanguage);

    const recSupported = service.isRecognitionSupported();
    const synSupported = service.isSynthesisSupported();

    setIsRecognitionSupported(recSupported);
    setIsSynthesisSupported(synSupported);
    setSupported(recSupported && synSupported);
    setVoices(service.getAvailableVoices());

    voiceServiceRef.current = service;

    return () => {
      service.destroy();
      voiceServiceRef.current = null;
    };
  }, [initialLanguage]);

  const startListening = useCallback((lang?: SupportedLanguage | "English", currentText?: string) => {
    setError("");
    const textToUse = currentText !== undefined ? currentText : transcriptRef.current;
    voiceServiceRef.current?.startListening(lang, textToUse);
  }, []);

  const stopListening = useCallback(() => {
    voiceServiceRef.current?.stopListening();
  }, []);

  const setTranscript = useCallback((text: string) => {
    setTranscriptState(text);
    voiceServiceRef.current?.setBaseText(text);
    if (process.env.NODE_ENV === "development") {
      console.log("[SpeechRecognition] State updated (manual)", { text });
    }
  }, []);

  const speak = useCallback((text: string, options?: SpeakOptions) => {
    setError("");
    return voiceServiceRef.current?.speak(text, options) ?? null;
  }, []);

  const pauseSpeaking = useCallback(() => {
    voiceServiceRef.current?.pauseSpeech();
  }, []);

  const resumeSpeaking = useCallback(() => {
    voiceServiceRef.current?.resumeSpeech();
  }, []);

  const stopSpeaking = useCallback(() => {
    voiceServiceRef.current?.stopSpeech();
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage | "English") => {
    voiceServiceRef.current?.setLanguage(lang);
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    supported,
    isRecognitionSupported,
    isSynthesisSupported,
    listening,
    speaking,
    paused,
    transcript,
    error,
    voices,
    setTranscript,
    startListening,
    stopListening,
    speak,
    pauseSpeaking,
    resumeSpeaking,
    stopSpeaking,
    setLanguage,
    clearError
  };
}
