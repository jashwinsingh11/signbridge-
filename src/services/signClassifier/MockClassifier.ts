import type { DetectedSign, SignLanguageCode } from '@/types';
import type { ClassifierFrameInput, SignClassifier } from './index';

/**
 * MockClassifier drives the UI with plausible detections so the app is
 * runnable without a trained model. It rotates through a small vocabulary
 * per language and exposes realistic-looking confidence values. Swap it
 * for a real classifier via `setActiveClassifier` in consuming screens.
 */
const VOCAB: Record<SignLanguageCode, string[]> = {
  ASL: ['HELLO', 'THANK-YOU', 'PLEASE', 'YES', 'NO', 'LEARN', 'SIGN', 'YOU', 'I', 'NAME'],
  BSL: ['HELLO', 'GOOD', 'MORNING', 'THANK-YOU', 'PLEASE', 'YES', 'NO'],
  ISL: ['NAMASTE', 'MOTHER', 'FATHER', 'FAMILY', 'YES', 'NO'],
  FSL: ['BULA', 'VINAKA', 'YES', 'NO'],
  Auslan: ['HELLO', 'THANKS', 'YES', 'NO'],
  LSF: ['BONJOUR', 'MERCI', 'OUI', 'NON'],
};

export class MockClassifier implements SignClassifier {
  readonly name = 'mock';
  public language: SignLanguageCode;
  private buffer: string[] = [];
  private lastEmittedAt = 0;
  private index = 0;

  constructor(language: SignLanguageCode = 'ASL') {
    this.language = language;
  }

  async prepare(): Promise<void> {
    /* nothing to warm up */
  }

  async dispose(): Promise<void> {
    this.buffer = [];
  }

  resetSentence(): void {
    this.buffer = [];
  }

  sentenceBuffer(): string[] {
    return [...this.buffer];
  }

  async classifyFrame(frame: ClassifierFrameInput): Promise<DetectedSign[]> {
    // Emit at most one detection every ~1200ms so the UI looks realistic.
    if (frame.timestampMs - this.lastEmittedAt < 1200) return [];
    this.lastEmittedAt = frame.timestampMs;

    const vocab = VOCAB[this.language] ?? VOCAB.ASL;
    const gloss = vocab[this.index % vocab.length];
    this.index += 1;

    const top: DetectedSign = {
      id: `${frame.timestampMs}-${gloss}`,
      gloss,
      confidence: 0.72 + Math.random() * 0.26,
      timestampMs: frame.timestampMs,
      language: this.language,
    };
    const alt = vocab[(this.index + 1) % vocab.length];
    const second: DetectedSign = {
      id: `${frame.timestampMs}-${alt}-alt`,
      gloss: alt,
      confidence: 0.25 + Math.random() * 0.3,
      timestampMs: frame.timestampMs,
      language: this.language,
    };
    this.buffer.push(top.gloss);
    if (this.buffer.length > 12) this.buffer.shift();
    return [top, second].sort((a, b) => b.confidence - a.confidence);
  }
}
