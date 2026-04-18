import { useCallback, useEffect, useRef } from 'react';

import { setTranscriber, startListening, stopListening } from '@/services/voice/stt';
import { useAccessibility } from '@/context/AccessibilityContext';

export interface VoiceCommand {
  phrases: string[];
  run: () => void;
  description: string;
}

/**
 * Lightweight voice-command system for blind users. The hook wraps the
 * underlying STT service and dispatches matched phrases to registered
 * commands. Without a real transcriber (see services/voice/stt.ts) the
 * hook is still wired and activates on press — integrators can call
 * `setTranscriber(...)` in app bootstrap to enable voice commands.
 */
export function useVoiceCommands(commands: VoiceCommand[], locale: string = 'en-US') {
  const { haptic, announce, settings } = useAccessibility();
  const activeRef = useRef(false);

  // Normalize command phrases once per render.
  const normalized = commands.map((c) => ({
    ...c,
    phrases: c.phrases.map((p) => p.toLowerCase().trim()),
  }));

  const start = useCallback(async () => {
    if (activeRef.current) return;
    try {
      await startListening();
      activeRef.current = true;
      haptic('light');
      announce('Listening for a voice command.');
    } catch (err) {
      haptic('error');
      announce('Could not start voice command. Check microphone permission.');
    }
  }, [announce, haptic]);

  const stop = useCallback(async () => {
    if (!activeRef.current) return;
    activeRef.current = false;
    const result = await stopListening(locale);
    haptic('light');
    if (!result || !result.text) {
      announce('No command detected.');
      return;
    }
    const spoken = result.text.toLowerCase();
    for (const cmd of normalized) {
      if (cmd.phrases.some((p) => spoken.includes(p))) {
        haptic('success');
        announce(`Running command: ${cmd.description}`);
        cmd.run();
        return;
      }
    }
    haptic('warning');
    announce('Command not recognized.');
  }, [announce, haptic, locale, normalized]);

  useEffect(() => {
    return () => {
      if (activeRef.current) {
        stopListening(locale).catch(() => undefined);
        activeRef.current = false;
      }
    };
  }, [locale]);

  return {
    start,
    stop,
    enabled: settings.voiceNavigation,
    setTranscriber,
    isActive: () => activeRef.current,
  };
}
