import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';

import type { AccessibilitySettings } from '@/types';
import { loadJSON, saveJSON, StorageKeys } from '@/services/storage';
import { themeForMode, type Theme } from '@/theme';
import { speak, stopSpeaking } from '@/services/voice/tts';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  voiceNavigation: false,
  hapticsEnabled: true,
  audioDescriptions: true,
  screenReaderAnnouncements: true,
  reduceMotion: false,
  fontScale: 1,
  themeMode: 'system',
  signingSpeed: 1,
  avatarStyle: 'modern',
  avatarSkinTone: 'medium',
};

type HapticPattern =
  | 'selection'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error';

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  setSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  theme: Theme;
  announce: (message: string, opts?: { speak?: boolean }) => void;
  haptic: (pattern: HapticPattern) => void;
  describe: (text: string) => void;
  stopDescribing: () => void;
  screenReaderEnabled: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    let mounted = true;
    loadJSON(StorageKeys.accessibilitySettings, DEFAULT_SETTINGS).then((loadedSettings) => {
      if (mounted) {
        setSettings({ ...DEFAULT_SETTINGS, ...loadedSettings });
        setLoaded(true);
      }
    });
    AccessibilityInfo.isScreenReaderEnabled().then((enabled) => {
      if (mounted) setScreenReaderEnabled(enabled);
    });
    const sub = AccessibilityInfo.addEventListener('screenReaderChanged', (enabled) => {
      setScreenReaderEnabled(enabled);
    });
    const motionSub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (enabled) => {
      setSettings((s) => ({ ...s, reduceMotion: enabled }));
    });
    return () => {
      mounted = false;
      sub?.remove?.();
      motionSub?.remove?.();
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveJSON(StorageKeys.accessibilitySettings, settings);
  }, [settings, loaded]);

  const setSetting = useCallback(<K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const theme = useMemo<Theme>(() => {
    if (settings.themeMode === 'system') {
      return themeForMode(colorScheme === 'dark' ? 'dark' : 'light');
    }
    return themeForMode(settings.themeMode);
  }, [settings.themeMode, colorScheme]);

  const haptic = useCallback((pattern: HapticPattern) => {
    if (!settings.hapticsEnabled) return;
    try {
      switch (pattern) {
        case 'selection':
          Haptics.selectionAsync();
          break;
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch {
      /* haptics unavailable on platform */
    }
  }, [settings.hapticsEnabled]);

  const announce = useCallback(
    (message: string, opts?: { speak?: boolean }) => {
      if (!message) return;
      if (settings.screenReaderAnnouncements) {
        AccessibilityInfo.announceForAccessibility(message);
      }
      if (opts?.speak && settings.audioDescriptions) {
        speak(message);
      }
    },
    [settings.screenReaderAnnouncements, settings.audioDescriptions],
  );

  const describe = useCallback(
    (text: string) => {
      if (!settings.audioDescriptions) return;
      speak(text);
    },
    [settings.audioDescriptions],
  );

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      settings,
      setSetting,
      resetSettings,
      theme,
      announce,
      haptic,
      describe,
      stopDescribing: stopSpeaking,
      screenReaderEnabled,
    }),
    [settings, setSetting, resetSettings, theme, announce, haptic, describe, screenReaderEnabled],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used inside AccessibilityProvider');
  return ctx;
}
