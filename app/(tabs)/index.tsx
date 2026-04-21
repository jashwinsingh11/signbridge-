import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { AccessibleButton } from '@/components/AccessibleButton';
import { XpBar } from '@/components/XpBar';
import { StreakFlame } from '@/components/StreakFlame';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { dailyChallenge, LESSONS } from '@/data/lessons';
import { signLanguageByCode } from '@/data/signLanguages';
import { DICTIONARY } from '@/data/dictionary';

export default function HomeScreen() {
  const router = useRouter();
  const { theme, settings, announce } = useAccessibility();
  const { profile, level, currentLevelXp, nextLevelXp, pingActivity } = useUserProfile();

  const lang = signLanguageByCode(profile.preferredSignLanguage);
  const challenge = useMemo(() => dailyChallenge(), []);

  useEffect(() => {
    pingActivity();
    announce(`Welcome to SignBridge. Your preferred sign language is ${lang?.name ?? 'ASL'}.`);
  }, [announce, lang?.name, pingActivity]);

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={[styles.eyebrow, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>
          SIGNBRIDGE · {profile.displayName.toUpperCase()}
        </Text>
        <Text style={[styles.title, { color: theme.colors.text, fontSize: 28 * settings.fontScale }]}>
          Bridge every conversation.
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted, fontSize: 15 * settings.fontScale }]}>
          Signing in {lang?.name ?? 'ASL'} · Voice in {profile.preferredSpokenLocale}
        </Text>
        <View style={styles.heroRow}>
          <StreakFlame streak={profile.streakDays} />
          <View style={{ flex: 1 }}>
            <XpBar level={level} current={currentLevelXp} next={nextLevelXp} compact />
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        <Card title="Detect sign" subtitle="Point the camera. We listen with our eyes." style={styles.gridItem}>
          <AccessibleButton title="Start detection" variant="primary" onPress={() => router.push('/detect')} />
        </Card>
        <Card title="Speak to sign" subtitle="Say something. Watch it sign back." style={styles.gridItem}>
          <AccessibleButton title="Start speaking" variant="secondary" onPress={() => router.push('/speak')} />
        </Card>
      </View>

      <Card title="Today's challenge" subtitle={challenge.title}>
        <Text style={[styles.challengeDesc, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>
          {challenge.description}
        </Text>
        <AccessibleButton title={`Practice ${challenge.title}`} variant="success" onPress={() => router.push(`/lesson/${challenge.id}`)} />
      </Card>

      <Card title="Explore">
        <View style={styles.tileRow}>
          <Tile label="Dictionary" count={`${DICTIONARY.length}`} onPress={() => router.push('/dictionary')} />
          <Tile label="Fingerspell" onPress={() => router.push('/fingerspell')} />
          <Tile label="Numbers" onPress={() => router.push('/numbers')} />
        </View>
        <View style={styles.tileRow}>
          <Tile label="Handshapes" onPress={() => router.push('/handshapes')} />
          <Tile label="Stats" onPress={() => router.push('/stats')} />
          <Tile label="Lessons" count={`${LESSONS.length}`} onPress={() => router.push('/learn')} />
        </View>
      </Card>

      <Card title="Quick actions">
        <AccessibleButton title="Two-way conversation" onPress={() => router.push('/chat')} variant="primary" />
        <AccessibleButton title="Profile & accessibility" onPress={() => router.push('/profile')} variant="ghost" />
      </Card>
    </Screen>
  );
}

function Tile({ label, count, onPress }: { label: string; count?: string; onPress: () => void }) {
  const { theme, settings, haptic } = useAccessibility();
  return (
    <AccessibleButton
      title={count ? `${label} (${count})` : label}
      variant="secondary"
      size="sm"
      onPress={() => {
        haptic('selection');
        onPress();
      }}
    />
  );
}

const styles = StyleSheet.create({
  hero: { gap: 6 },
  eyebrow: { fontWeight: '700', letterSpacing: 2 },
  title: { fontWeight: '800' },
  subtitle: {},
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  grid: { flexDirection: 'row', gap: 12 },
  gridItem: { flex: 1 },
  challengeDesc: {},
  tileRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
});
