import * as Speech from 'expo-speech';

export interface SpeakOptions {
  locale?: string;
  rate?: number;
  pitch?: number;
  onDone?: () => void;
}

export function speak(text: string, opts: SpeakOptions = {}): void {
  if (!text) return;
  Speech.speak(text, {
    language: opts.locale,
    rate: opts.rate ?? 1,
    pitch: opts.pitch ?? 1,
    onDone: opts.onDone,
  });
}

export function stopSpeaking(): void {
  Speech.stop();
}

export async function getAvailableVoices(): Promise<Speech.Voice[]> {
  try {
    return await Speech.getAvailableVoicesAsync();
  } catch {
    return [];
  }
}
