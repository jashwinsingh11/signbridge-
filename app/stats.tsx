import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { XpBar } from '@/components/XpBar';
import { StreakFlame } from '@/components/StreakFlame';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { useConversations } from '@/context/ConversationContext';
import { LESSONS, BADGES } from '@/data/lessons';

export default function StatsScreen() {
  const { theme, settings } = useAccessibility();
  const { profile, level, currentLevelXp, nextLevelXp, topVocabulary } = useUserProfile();
  const { conversations } = useConversations();

  const practiceBySuccess = useMemo(() => {
    const total = profile.practiceHistory.length;
    const correct = profile.practiceHistory.filter((a) => a.correct).length;
    return { total, correct, accuracy: total === 0 ? 0 : correct / total };
  }, [profile.practiceHistory]);

  const languageBreakdown = Object.entries(profile.lessonsPracticedByLanguage);
  const top = topVocabulary(6);

  return (
    <Screen>
      <Text style={[styles.heading, { color: theme.colors.text, fontSize: 26 * settings.fontScale }]}>Your stats</Text>
      <View style={{ marginTop: 8, marginBottom: 12 }}>
        <StreakFlame streak={profile.streakDays} />
      </View>

      <Card title="Level">
        <XpBar level={level} current={currentLevelXp} next={nextLevelXp} />
        <Text style={{ color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }}>
          Total XP: {profile.xp}
        </Text>
      </Card>

      <Card title="Practice">
        <Stat label="Total attempts" value={practiceBySuccess.total} />
        <Stat label="Correct" value={practiceBySuccess.correct} />
        <Stat label="Accuracy" value={`${Math.round(practiceBySuccess.accuracy * 100)}%`} />
        <Stat label="Lessons completed" value={profile.completedLessonIds.length} total={LESSONS.length} />
      </Card>

      <Card title="Languages practiced">
        {languageBreakdown.length === 0 ? (
          <Text style={{ color: theme.colors.textMuted }}>Practice a lesson to start tracking.</Text>
        ) : (
          languageBreakdown.map(([lang, count]) => <Stat key={lang} label={lang} value={count} />)
        )}
      </Card>

      <Card title={`Badges (${profile.badges.length}/${BADGES.length})`}>
        <View style={styles.badgeGrid}>
          {BADGES.map((b) => {
            const earned = profile.badges.some((e) => e.id === b.id);
            return (
              <View
                key={b.id}
                style={[
                  styles.badge,
                  {
                    backgroundColor: earned ? theme.colors.surfaceElevated : theme.colors.surface,
                    borderColor: earned ? theme.colors.primary : theme.colors.border,
                    opacity: earned ? 1 : 0.45,
                  },
                ]}
              >
                <Text style={{ fontSize: 22 }}>{b.icon}</Text>
                <Text style={{ color: theme.colors.text, fontWeight: '700', fontSize: 12 * settings.fontScale }} numberOfLines={1}>
                  {b.title}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>

      <Card title="Top vocabulary">
        {top.length === 0 ? (
          <Text style={{ color: theme.colors.textMuted }}>Start signing to build your personal dictionary.</Text>
        ) : (
          top.map((v) => <Stat key={v.gloss} label={v.gloss} value={`${v.count}×`} />)
        )}
      </Card>

      <Card title="Conversations">
        <Stat label="Total" value={conversations.length} />
        <Stat label="Turns" value={conversations.reduce((n, c) => n + c.turns.length, 0)} />
      </Card>
    </Screen>
  );
}

function Stat({ label, value, total }: { label: string; value: number | string; total?: number }) {
  const { theme, settings } = useAccessibility();
  return (
    <View style={styles.row} accessibilityLabel={`${label}: ${value}${total != null ? ` of ${total}` : ''}.`}>
      <Text style={[styles.rowLabel, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>
        {value}
        {total != null ? ` / ${total}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: {},
  rowValue: { fontWeight: '800' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    width: '30%',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
});
