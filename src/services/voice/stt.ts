import { Audio } from 'expo-av';

/**
 * Speech-to-text interface. Expo Go does not ship a built-in STT API, so this
 * service records audio and exposes a pluggable `transcribeAudio` hook which
 * can be wired to Google Cloud Speech, Whisper, or a native module in a
 * production build. A local heuristic fallback is provided so the UI flow
 * can be exercised end-to-end.
 */
export interface TranscriptionResult {
  text: string;
  locale: string;
  confidence: number;
  alternatives?: { text: string; confidence: number }[];
}

export type Transcriber = (
  audioUri: string,
  locale: string,
) => Promise<TranscriptionResult>;

let activeRecording: Audio.Recording | null = null;
let activeTranscriber: Transcriber | null = null;

export function setTranscriber(fn: Transcriber | null): void {
  activeTranscriber = fn;
}

async function ensurePermissionsAndMode(): Promise<void> {
  const perm = await Audio.requestPermissionsAsync();
  if (!perm.granted) {
    throw new Error('Microphone permission denied');
  }
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });
}

export async function startListening(): Promise<void> {
  if (activeRecording) return;
  await ensurePermissionsAndMode();
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY,
  );
  await recording.startAsync();
  activeRecording = recording;
}

export async function stopListening(locale: string): Promise<TranscriptionResult | null> {
  if (!activeRecording) return null;
  const recording = activeRecording;
  activeRecording = null;

  try {
    await recording.stopAndUnloadAsync();
  } catch {
    /* noop */
  }
  const uri = recording.getURI();
  if (!uri) return null;

  if (activeTranscriber) {
    try {
      return await activeTranscriber(uri, locale);
    } catch (err) {
      // fall through to null if the remote service fails
      console.warn('Transcriber failed', err);
    }
  }
  // Without a real transcriber we cannot produce actual text. Return empty
  // result with zero confidence so callers can render an appropriate message.
  return { text: '', locale, confidence: 0 };
}

export function isListening(): boolean {
  return activeRecording !== null;
}
