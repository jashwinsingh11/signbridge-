import type { DetectedSign, SignLanguageCode } from '@/types';

/**
 * Pluggable sign language classifier interface. Real implementations can
 * wrap TensorFlow Lite, MediaPipe Hands, or a remote inference endpoint.
 * The UI layer depends only on this interface.
 */
export interface SignClassifier {
  readonly name: string;
  readonly language: SignLanguageCode;
  /** Warm up any underlying models. Safe to call repeatedly. */
  prepare(): Promise<void>;
  /** Release any underlying resources. */
  dispose(): Promise<void>;
  /**
   * Classify the most recent frame buffer. Implementations typically keep
   * internal temporal state so they can recognize continuous signing.
   * The returned array is sorted by confidence (highest first).
   */
  classifyFrame(frame: ClassifierFrameInput): Promise<DetectedSign[]>;
  /** Reset any sentence-level buffer state. */
  resetSentence(): void;
  /** Current running sentence buffer as gloss tokens. */
  sentenceBuffer(): string[];
}

export interface ClassifierFrameInput {
  /** Monotonic timestamp in milliseconds. */
  timestampMs: number;
  /** Optional raw pose landmarks if the pipeline exposes them. */
  landmarks?: number[];
  /** Optional frame width/height for normalization. */
  width?: number;
  height?: number;
}

export { MockClassifier } from './MockClassifier';
