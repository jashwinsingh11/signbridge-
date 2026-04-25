import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { DetectedSign, SignLanguageCode } from '@/types';
import { MockClassifier, type SignClassifier } from '@/services/signClassifier';

export interface SignDetectionState {
  running: boolean;
  latest: DetectedSign | null;
  alternates: DetectedSign[];
  sentence: string[];
  fps: number;
}

export interface SignDetectionControls extends SignDetectionState {
  start: () => void;
  stop: () => void;
  reset: () => void;
  setClassifier: (c: SignClassifier) => void;
  onSignDetected?: (sign: DetectedSign) => void;
}

/**
 * Headless loop that drives a SignClassifier at a fixed rate. Separating
 * this from the camera preview keeps the screen declarative and lets us
 * swap classifiers (mock, TFLite, remote) without touching the UI.
 */
export function useSignDetection(
  initialLanguage: SignLanguageCode,
  onSign?: (sign: DetectedSign) => void,
  intervalMs: number = 150,
): SignDetectionControls {
  const classifierRef = useRef<SignClassifier>(new MockClassifier(initialLanguage));
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [state, setState] = useState<SignDetectionState>({
    running: false,
    latest: null,
    alternates: [],
    sentence: [],
    fps: 0,
  });
  const frameCountRef = useRef(0);
  const fpsTickRef = useRef(Date.now());
  const fpsRef = useRef(0);
  const onSignRef = useRef(onSign);
  useEffect(() => {
    onSignRef.current = onSign;
  }, [onSign]);

  useEffect(() => {
    classifierRef.current.prepare().catch(() => undefined);
    return () => {
      classifierRef.current.dispose().catch(() => undefined);
      if (rafRef.current) clearInterval(rafRef.current);
    };
  }, []);

  const tick = useCallback(async () => {
    const now = Date.now();
    frameCountRef.current += 1;
    const elapsed = now - fpsTickRef.current;
    let fpsNext = fpsRef.current;
    if (elapsed >= 1000) {
      fpsNext = Math.round((frameCountRef.current * 1000) / elapsed);
      frameCountRef.current = 0;
      fpsTickRef.current = now;
      fpsRef.current = fpsNext;
    }
    const results = await classifierRef.current.classifyFrame({ timestampMs: now });
    if (results.length === 0) {
      if (fpsNext !== fpsRef.current || elapsed >= 1000) setState((s) => ({ ...s, fps: fpsNext }));
      return;
    }
    const [top, ...rest] = results;
    setState({
      running: true,
      latest: top,
      alternates: rest,
      sentence: classifierRef.current.sentenceBuffer(),
      fps: fpsNext,
    });
    onSignRef.current?.(top);
  }, []);

  const tickRef = useRef(tick);
  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const start = useCallback(() => {
    if (rafRef.current) return;
    setState((s) => ({ ...s, running: true }));
    frameCountRef.current = 0;
    fpsTickRef.current = Date.now();
    rafRef.current = setInterval(() => {
      void tickRef.current();
    }, intervalMs);
  }, [intervalMs]);

  const stop = useCallback(() => {
    if (rafRef.current) {
      clearInterval(rafRef.current);
      rafRef.current = null;
    }
    setState((s) => ({ ...s, running: false }));
  }, []);

  const reset = useCallback(() => {
    classifierRef.current.resetSentence();
    setState((s) => ({ ...s, sentence: [], latest: null, alternates: [] }));
  }, []);

  const setClassifier = useCallback((c: SignClassifier) => {
    classifierRef.current.dispose().catch(() => undefined);
    classifierRef.current = c;
    c.prepare().catch(() => undefined);
  }, []);

  return useMemo(
    () => ({ ...state, start, stop, reset, setClassifier }),
    [state, start, stop, reset, setClassifier],
  );
}
