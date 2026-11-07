"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

interface SpeechResultEventLike { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }
interface SpeechErrorEventLike { error: string }
interface RecognitionLike {
  continuous: boolean; interimResults: boolean; lang: string;
  onresult: ((event: SpeechResultEventLike) => void) | null;
  onerror: ((event: SpeechErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}
type RecognitionConstructor = new () => RecognitionLike;
const subscribeToBrowserSupport = () => () => undefined;

function recognitionConstructor(): RecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const speechWindow = window as Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition() {
  const recognition = useRef<RecognitionLike | null>(null);
  const [listening, setListening] = useState(false);
  const supported = useSyncExternalStore(subscribeToBrowserSupport, () => recognitionConstructor() !== null, () => false);

  const stop = useCallback(() => { recognition.current?.stop(); setListening(false); }, []);
  const start = useCallback((onText: (text: string) => void, onError: (message: string) => void) => {
    const Constructor = recognitionConstructor();
    if (!Constructor) { onError("Speech recognition is not supported in this browser. You can type your answer instead."); return; }
    try {
      const instance = new Constructor();
      instance.continuous = false; instance.interimResults = true; instance.lang = "en-US";
      instance.onresult = (event) => {
        const text = Array.from(event.results).map((result) => result[0].transcript).join(" ");
        onText(text);
      };
      instance.onerror = (event) => {
        setListening(false);
        onError(event.error === "not-allowed" ? "Microphone access was denied. Check browser permissions or continue by typing." : `Speech input stopped: ${event.error}. You can continue by typing.`);
      };
      instance.onend = () => setListening(false);
      recognition.current = instance; instance.start(); setListening(true);
    } catch {
      onError("The browser could not start speech recognition. You can continue by typing."); setListening(false);
    }
  }, []);
  useEffect(() => {
    return () => recognition.current?.abort();
  }, []);
  return { supported, listening, start, stop };
}

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false);
  const supported = useSyncExternalStore(subscribeToBrowserSupport, () => "speechSynthesis" in window, () => false);
  const stop = useCallback(() => { if (supported) window.speechSynthesis.cancel(); setSpeaking(false); }, [supported]);
  const speak = useCallback((text: string, onError: (message: string) => void) => {
    if (!supported) { onError("Text-to-speech is not supported in this browser."); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96; utterance.pitch = 1.02;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => { setSpeaking(false); onError("Speech playback was interrupted by the browser."); };
    window.speechSynthesis.speak(utterance);
  }, [supported]);
  useEffect(() => {
    return stop;
  }, [stop]);
  return { supported, speaking, speak, stop };
}
