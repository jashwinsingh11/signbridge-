import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { AccessibleButton } from '@/components/AccessibleButton';
import { EmptyState } from '@/components/EmptyState';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { SIGN_LANGUAGES, SPOKEN_LANGUAGES } from '@/data/signLanguages';
import type { AccessibilitySettings, CustomGesture, SignLanguageCode, SpokenLocale } from '@/types';

export default function ProfileScreen() {
  const { theme, settings, setSetting, resetSettings } = useAccessibility();
  const { profile, update, addCustomGesture, removeCustomGesture, topVocabulary } = useUserProfile();
  const [gestureName, setGestureName] = useState('');
  const [gestureDesc, setGestureDesc] = useState('');

  const vocab = topVocabulary(8);

  const onAddGesture = () => {
    const gloss = gestureName.trim();
    if (!gloss) {
      Alert.alert('Name required', 'Please give your custom gesture a name.');
      return;
    }
    const g: CustomGesture = {
      id: `cg-${Date.now().toString(36)}`,
      gloss,
      description: gestureDesc.trim(),
      createdAt: Date.now(),
      sampleCount: 0,
    };
    addCustomGesture(g);
    setGestureName('');
    setGestureDesc('');
  };

  return (
    <Screen>
      <Card title="Profile">
        <Text style={[styles.label, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>Display name</Text>
        <TextInput
          value={profile.displayName}
          onChangeText={(v) => update({ displayName: v })}
          placeholder="Your name"
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, fontSize: 15 * settings.fontScale }]}
          accessibilityLabel="Display name"
        />
        <Text style={[styles.label, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>Preferred sign language</Text>
        <View style={styles.chipRow}>
          {SIGN_LANGUAGES.map((l) => (
            <Chip
              key={l.code}
              label={l.name}
              selected={profile.preferredSignLanguage === l.code}
              onPress={() => update({ preferredSignLanguage: l.code as SignLanguageCode })}
            />
          ))}
        </View>
        <Text style={[styles.label, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>Preferred spoken language</Text>
        <View style={styles.chipRow}>
          {SPOKEN_LANGUAGES.map((l) => (
            <Chip
              key={l.locale}
              label={l.nativeName}
              selected={profile.preferredSpokenLocale === l.locale}
              onPress={() => update({ preferredSpokenLocale: l.locale as SpokenLocale })}
            />
          ))}
        </View>
      </Card>

      <Card title="Accessibility">
        <SettingToggle
          label="Voice navigation"
          hint="Use voice commands to navigate the app."
          value={settings.voiceNavigation}
          onValueChange={(v) => setSetting('voiceNavigation', v)}
        />
        <SettingToggle
          label="Haptic feedback"
          hint="Vibrate on key actions and successful detections."
          value={settings.hapticsEnabled}
          onValueChange={(v) => setSetting('hapticsEnabled', v)}
        />
        <SettingToggle
          label="Audio descriptions"
          hint="Speak detected signs aloud."
          value={settings.audioDescriptions}
          onValueChange={(v) => setSetting('audioDescriptions', v)}
        />
        <SettingToggle
          label="Screen reader announcements"
          hint="Send additional announcements to the system screen reader."
          value={settings.screenReaderAnnouncements}
          onValueChange={(v) => setSetting('screenReaderAnnouncements', v)}
        />
        <SettingToggle
          label="Reduce motion"
          hint="Minimize avatar animation and transitions."
          value={settings.reduceMotion}
          onValueChange={(v) => setSetting('reduceMotion', v)}
        />

        <Text style={[styles.label, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>Font size</Text>
        <View style={styles.chipRow}>
          {[0.85, 1, 1.15, 1.3, 1.5].map((scale) => (
            <Chip
              key={scale}
              label={`${Math.round(scale * 100)}%`}
              selected={Math.abs(settings.fontScale - scale) < 0.01}
              onPress={() => setSetting('fontScale', scale)}
            />
          ))}
        </View>

        <Text style={[styles.label, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>Theme</Text>
        <View style={styles.chipRow}>
          {(['system', 'light', 'dark', 'high-contrast'] as AccessibilitySettings['themeMode'][]).map((t) => (
            <Chip
              key={t}
              label={t}
              selected={settings.themeMode === t}
              onPress={() => setSetting('themeMode', t)}
            />
          ))}
        </View>
      </Card>

      <Card title="Custom gesture library" subtitle="Add personal signs that matter to you.">
        <TextInput
          value={gestureName}
          onChangeText={setGestureName}
          placeholder="Gesture name (e.g. OUR-DOG)"
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, fontSize: 15 * settings.fontScale }]}
          accessibilityLabel="Custom gesture name"
        />
        <TextInput
          value={gestureDesc}
          onChangeText={setGestureDesc}
          placeholder="Description / handshape notes"
          placeholderTextColor={theme.colors.textMuted}
          multiline
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, fontSize: 15 * settings.fontScale, minHeight: 60 }]}
          accessibilityLabel="Custom gesture description"
        />
        <AccessibleButton title="Save gesture" variant="primary" onPress={onAddGesture} />
        {profile.customGestures.length === 0 ? (
          <EmptyState icon="✧" title="No custom gestures yet" />
        ) : (
          profile.customGestures.map((g) => (
            <View key={g.id} style={[styles.gestureRow, { borderColor: theme.colors.border }]}>
              <View style={styles.flex1}>
                <Text style={[styles.gestureName, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>{g.gloss}</Text>
                <Text style={[styles.gestureDesc, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>{g.description || '—'}</Text>
              </View>
              <AccessibleButton title="Remove" size="sm" variant="ghost" onPress={() => removeCustomGesture(g.id)} />
            </View>
          ))
        )}
      </Card>

      <Card title="Your vocabulary" subtitle="Signs you use the most">
        {vocab.length === 0 ? (
          <EmptyState icon="·" title="No usage yet" description="Start detecting or speaking to build your vocabulary." />
        ) : (
          vocab.map((v) => (
            <View key={v.gloss} style={styles.vocabRow}>
              <Text style={[styles.vocabWord, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>{v.gloss}</Text>
              <Text style={[styles.vocabCount, { color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }]}>{v.count}×</Text>
            </View>
          ))
        )}
      </Card>

      <Card title="Reset">
        <AccessibleButton title="Reset accessibility settings" variant="ghost" onPress={() => resetSettings()} />
      </Card>
    </Screen>
  );
}

function SettingToggle({
  label,
  hint,
  value,
  onValueChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  const { theme, settings } = useAccessibility();
  return (
    <View style={styles.toggleRow} accessibilityLabel={`${label}. ${hint}`} accessibilityRole="switch" accessibilityState={{ checked: value }}>
      <View style={styles.flex1}>
        <Text style={[styles.toggleLabel, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>{label}</Text>
        <Text style={[styles.toggleHint, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>{hint}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  input: { borderWidth: 1, borderRadius: 12, padding: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  toggleLabel: { fontWeight: '700' },
  toggleHint: {},
  flex1: { flex: 1 },
  gestureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1 },
  gestureName: { fontWeight: '700' },
  gestureDesc: {},
  vocabRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  vocabWord: { fontWeight: '700' },
  vocabCount: {},
});
