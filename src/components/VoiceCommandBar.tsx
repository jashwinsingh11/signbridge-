import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAccessibility } from '@/context/AccessibilityContext';
import { useVoiceCommands, type VoiceCommand } from '@/hooks/useVoiceCommands';

/**
 * Floating voice command bar. Tap the mic to listen. Without a speech-to-text
 * integration this also supports a pop-up command palette so the user can
 * invoke actions with a single tap (useful for demos and testing).
 */
export function VoiceCommandBar() {
  const router = useRouter();
  const { theme, settings, haptic } = useAccessibility();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const commands = useMemo<VoiceCommand[]>(
    () => [
      { phrases: ['open detect', 'start detect', 'sign detect'], description: 'open sign detection', run: () => router.push('/detect') },
      { phrases: ['open speak', 'voice to sign'], description: 'open voice-to-sign', run: () => router.push('/speak') },
      { phrases: ['open chat', 'open conversation'], description: 'open conversation', run: () => router.push('/chat') },
      { phrases: ['open learn', 'lessons'], description: 'open lessons', run: () => router.push('/learn') },
      { phrases: ['open profile', 'open settings'], description: 'open profile', run: () => router.push('/profile') },
      { phrases: ['open dictionary', 'show dictionary'], description: 'open dictionary', run: () => router.push('/dictionary') },
      { phrases: ['fingerspell', 'finger spell'], description: 'open fingerspelling trainer', run: () => router.push('/fingerspell') },
      { phrases: ['numbers', 'practice numbers'], description: 'open number practice', run: () => router.push('/numbers') },
      { phrases: ['handshapes', 'hand shapes', 'show handshapes'], description: 'open handshape reference', run: () => router.push('/handshapes') },
      { phrases: ['stats', 'my progress', 'show stats'], description: 'open stats', run: () => router.push('/stats') },
      { phrases: ['home', 'go home'], description: 'open home', run: () => router.push('/(tabs)') },
    ],
    [router],
  );

  const { start, stop, isActive, enabled } = useVoiceCommands(commands);

  if (!enabled) return null;

  return (
    <View pointerEvents="box-none" style={styles.container}>
      {paletteOpen ? (
        <View style={[styles.palette, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text, fontSize: 14 * settings.fontScale }]}>Voice commands</Text>
          {commands.map((c) => (
            <Pressable
              key={c.description}
              accessibilityRole="button"
              accessibilityLabel={`Run command: ${c.description}`}
              onPress={() => {
                haptic('selection');
                setPaletteOpen(false);
                c.run();
              }}
              style={styles.cmdRow}
            >
              <Text style={{ color: theme.colors.text, fontSize: 13 * settings.fontScale, fontWeight: '700' }}>
                {c.description}
              </Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 11 * settings.fontScale }}>
                Say “{c.phrases[0]}”
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.buttons}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show voice command palette"
          onPress={() => {
            haptic('light');
            setPaletteOpen((v) => !v);
          }}
          style={[styles.fab, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <Text style={{ color: theme.colors.text, fontSize: 18 }}>⌘</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isActive() ? 'Stop listening' : 'Start listening for a voice command'}
          onPressIn={() => {
            haptic('medium');
            void start();
          }}
          onPressOut={() => {
            void stop();
          }}
          style={[styles.fab, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
        >
          <Text style={{ color: theme.colors.primaryContrast, fontSize: 18 }}>🎙</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 82,
    alignItems: 'flex-end',
    gap: 8,
  },
  palette: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    gap: 6,
    maxWidth: 260,
  },
  title: { fontWeight: '800', marginBottom: 4 },
  cmdRow: { paddingVertical: 4 },
  buttons: { flexDirection: 'row', gap: 8 },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
