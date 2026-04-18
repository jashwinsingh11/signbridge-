import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { AccessibleButton } from '@/components/AccessibleButton';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { dailyChallenge, LESSONS } from '@/data/lessons';
import { signLanguageByCode } from '@/data/signLanguages';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, settings, announce } = useAccessibility();
  const { profile } = useUserProfile();

  const lang = signLanguageByCode(profile.preferredSignLanguage);
  const challenge = useMemo(() => dailyChallenge(), []);

  useEffect(() => {
    announce(`Welcome to SignBridge. Your preferred sign language is ${lang?.name ?? 'ASL'}.`);
  }, [announce, lang?.name]);

  const badgeCount = profile.badges.length;
  const practiceCount = profile.practiceHistory.length;

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={[styles.eyebrow, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>
          SIGNBRIDGE
        </Text>
        <Text style={[styles.title, { color: theme.colors.text, fontSize: 28 * settings.fontScale }]}>
          Bridge every conversation.
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted, fontSize: 15 * settings.fontScale }]}>
          Signing in {lang?.name ?? 'ASL'} · Voice in {profile.preferredSpokenLocale}
        </Text>
      </View>

      <View style={styles.grid}>
        <Card title="Detect sign" subtitle="Point the camera. We listen with our eyes." style={styles.gridItem}>
          <AccessibleButton
            title="Start detection"
            variant="primary"
            onPress={() => router.push('/detect')}
            accessibilityHint="Opens the camera to translate signed phrases into text."
          />
        </Card>
        <Card title="Speak to sign" subtitle="Say something. Watch it sign back." style={styles.gridItem}>
          <AccessibleButton
            title="Start speaking"
            variant="secondary"
            onPress={() => router.push('/speak')}
            accessibilityHint="Record your voice and animate a signing avatar."
          />
        </Card>
      </View>

      <Card title="Daily challenge" subtitle={challenge.title}>
        <Text style={[styles.challengeDesc, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>
          {challenge.description}
        </Text>
        <AccessibleButton
          title={`Practice ${challenge.title}`}
          variant="success"
          onPress={() => router.push(`/lesson/${challenge.id}`)}
          accessibilityHint="Start today's featured lesson."
        />
      </Card>

      <Card title="Your progress">
        <Stat label="Badges earned" value={badgeCount} theme={theme} scale={settings.fontScale} />
        <Stat label="Practice attempts" value={practiceCount} theme={theme} scale={settings.fontScale} />
        <Stat label="Custom gestures" value={profile.customGestures.length} theme={theme} scale={settings.fontScale} />
        <Stat label="Lessons available" value={LESSONS.length} theme={theme} scale={settings.fontScale} />
      </Card>

      <Card title="Quick actions">
        <AccessibleButton
          title="Two-way conversation"
          onPress={() => router.push('/chat')}
          variant="primary"
          accessibilityHint="Open a live conversation with both signing and voice."
        />
        <AccessibleButton
          title="Learn & practice"
          onPress={() => router.push('/learn')}
          variant="secondary"
        />
        <AccessibleButton
          title="Profile & accessibility"
          onPress={() => router.push('/profile')}
          variant="ghost"
        />
      </Card>
    </Screen>
  );
}

function Stat({
  label,
  value,
  theme,
  scale,
}: {
  label: string;
  value: number;
  theme: ReturnType<typeof useAccessibility>['theme'];
  scale: number;
}) {
  return (
    <View style={styles.statRow} accessibilityLabel={`${label}: ${value}.`}>
      <Text style={[styles.statLabel, { color: theme.colors.textMuted, fontSize: 14 * scale }]}>{label}</Text>
      <Text style={[styles.statValue, { color: theme.colors.text, fontSize: 18 * scale }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { gap: 6 },
  eyebrow: { fontWeight: '700', letterSpacing: 2 },
  title: { fontWeight: '800' },
  subtitle: {},
  grid: { flexDirection: 'row', gap: 12 },
  gridItem: { flex: 1 },
  challengeDesc: {},
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: {},
  statValue: { fontWeight: '800' },
});
