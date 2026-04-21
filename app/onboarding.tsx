import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera } from 'expo-camera';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { AccessibleButton } from '@/components/AccessibleButton';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { SIGN_LANGUAGES } from '@/data/signLanguages';
import type { SignLanguageCode, SpokenLocale } from '@/types';

const STEPS = ['welcome', 'languages', 'accessibility', 'permissions', 'finish'] as const;
type Step = (typeof STEPS)[number];

const SPOKEN: { code: SpokenLocale; label: string }[] = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'fj-FJ', label: 'Fijian' },
];

export default function Onboarding() {
  const router = useRouter();
  const { theme, settings, setSetting, haptic, announce } = useAccessibility();
  const { update, pingActivity } = useUserProfile();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [sign, setSign] = useState<SignLanguageCode>('ASL');
  const [spoken, setSpoken] = useState<SpokenLocale>('en-US');

  const go = (s: Step) => {
    haptic('selection');
    setStep(s);
    announce(`Step ${STEPS.indexOf(s) + 1} of ${STEPS.length}`);
  };

  const finish = () => {
    update({
      displayName: name.trim() || 'You',
      preferredSignLanguage: sign,
      preferredSpokenLocale: spoken,
      onboardingCompleted: true,
    });
    pingActivity();
    haptic('success');
    router.replace('/(tabs)');
  };

  const requestPerms = async () => {
    try {
      await Camera.requestCameraPermissionsAsync();
    } catch {
      /* web / unsupported */
    }
    go('finish');
  };

  const idx = STEPS.indexOf(step);

  return (
    <Screen>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={`Onboarding step ${idx + 1} of ${STEPS.length}`}
        style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}
      >
        <View
          style={[
            styles.progressFill,
            { backgroundColor: theme.colors.primary, width: `${((idx + 1) / STEPS.length) * 100}%` },
          ]}
        />
      </View>

      {step === 'welcome' && (
        <Card title="Welcome to SignBridge" subtitle="A two-way translator for signed and spoken conversation.">
          <Text style={[styles.para, { color: theme.colors.textMuted, fontSize: 15 * settings.fontScale }]}>
            SignBridge detects sign language through the camera, animates an avatar from your voice, and teaches you to sign. Everything works offline by default — voice, haptics, and TTS run on-device.
          </Text>
          <Text style={[styles.bullet, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>• Real-time sign detection</Text>
          <Text style={[styles.bullet, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>• Voice-to-sign avatar</Text>
          <Text style={[styles.bullet, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>• Lessons, badges, streaks</Text>
          <Text style={[styles.bullet, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>• Voice navigation + haptic feedback</Text>
          <AccessibleButton title="Let's begin" onPress={() => go('languages')} variant="primary" />
        </Card>
      )}

      {step === 'languages' && (
        <Card title="Your languages" subtitle="Pick what you sign and speak.">
          <Text style={[styles.label, { color: theme.colors.text }]}>Preferred sign language</Text>
          <View style={styles.wrap}>
            {SIGN_LANGUAGES.map((l) => (
              <Chip key={l.code} label={l.name} selected={sign === l.code} onPress={() => setSign(l.code)} />
            ))}
          </View>
          <Text style={[styles.label, { color: theme.colors.text, marginTop: 12 }]}>Preferred spoken language</Text>
          <View style={styles.wrap}>
            {SPOKEN.map((s) => (
              <Chip key={s.code} label={s.label} selected={spoken === s.code} onPress={() => setSpoken(s.code)} />
            ))}
          </View>
          <View style={styles.row}>
            <AccessibleButton title="Back" onPress={() => go('welcome')} variant="ghost" />
            <AccessibleButton title="Next" onPress={() => go('accessibility')} variant="primary" />
          </View>
        </Card>
      )}

      {step === 'accessibility' && (
        <Card title="Accessibility" subtitle="You can change any of this later.">
          <Toggle label="Voice navigation" value={settings.voiceNavigation} onChange={(v) => setSetting('voiceNavigation', v)} />
          <Toggle label="Haptic feedback" value={settings.hapticsEnabled} onChange={(v) => setSetting('hapticsEnabled', v)} />
          <Toggle label="Audio descriptions" value={settings.audioDescriptions} onChange={(v) => setSetting('audioDescriptions', v)} />
          <Toggle label="Reduce motion" value={settings.reduceMotion} onChange={(v) => setSetting('reduceMotion', v)} />
          <View style={styles.row}>
            <AccessibleButton title="Back" onPress={() => go('languages')} variant="ghost" />
            <AccessibleButton title="Next" onPress={() => go('permissions')} variant="primary" />
          </View>
        </Card>
      )}

      {step === 'permissions' && (
        <Card title="Camera access" subtitle="Needed for real-time sign detection and practice feedback.">
          <Text style={[styles.para, { color: theme.colors.textMuted, fontSize: 15 * settings.fontScale }]}>
            SignBridge only uses the camera while the Detect or Practice screen is open. Frames are processed on-device.
          </Text>
          <View style={styles.row}>
            <AccessibleButton title="Skip" onPress={() => go('finish')} variant="ghost" />
            <AccessibleButton title="Allow camera" onPress={requestPerms} variant="primary" />
          </View>
        </Card>
      )}

      {step === 'finish' && (
        <Card title="You're all set!" subtitle="Bridge your first conversation in under a minute.">
          <Text style={[styles.para, { color: theme.colors.textMuted, fontSize: 15 * settings.fontScale }]}>
            Your language preferences and accessibility settings are saved. Earn XP by practicing daily — your streak starts today.
          </Text>
          <AccessibleButton title="Enter SignBridge" onPress={finish} variant="success" />
        </Card>
      )}
    </Screen>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  const { theme, settings } = useAccessibility();
  return (
    <View style={styles.toggleRow}>
      <Text style={{ color: theme.colors.text, fontSize: 15 * settings.fontScale, flex: 1 }}>{label}</Text>
      <AccessibleButton
        title={value ? 'On' : 'Off'}
        size="sm"
        variant={value ? 'success' : 'ghost'}
        onPress={() => onChange(!value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressTrack: { height: 6, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%' },
  para: {},
  bullet: { marginLeft: 4 },
  label: { fontWeight: '700', marginBottom: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  row: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end', marginTop: 8 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
