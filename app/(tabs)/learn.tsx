import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { AccessibleButton } from '@/components/AccessibleButton';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { BADGES, dailyChallenge, LESSONS } from '@/data/lessons';
import type { Lesson } from '@/types';

export default function LearnScreen() {
  const router = useRouter();
  const { theme, settings } = useAccessibility();
  const { profile } = useUserProfile();
  const [difficulty, setDifficulty] = useState<'all' | Lesson['difficulty']>('all');
  const challenge = useMemo(() => dailyChallenge(), []);

  const filtered = LESSONS.filter((l) => difficulty === 'all' || l.difficulty === difficulty);

  const earnedIds = new Set(profile.badges.map((b) => b.id));
  const lessonProgress = (id: string) => {
    const attempts = profile.practiceHistory.filter((a) => a.lessonId === id);
    const correct = attempts.filter((a) => a.correct).length;
    const total = attempts.length || 1;
    return Math.round((correct / total) * 100);
  };

  return (
    <Screen>
      <Card title="Daily challenge" subtitle={challenge.title}>
        <Text style={[styles.text, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>{challenge.description}</Text>
        <AccessibleButton title="Start challenge" variant="success" onPress={() => router.push(`/lesson/${challenge.id}`)} />
      </Card>

      <Card title="Lessons">
        <View style={styles.chipRow}>
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((d) => (
            <Chip key={d} label={d} selected={difficulty === d} onPress={() => setDifficulty(d)} />
          ))}
        </View>
        {filtered.map((lesson) => (
          <View
            key={lesson.id}
            style={[styles.lessonRow, { borderColor: theme.colors.border }]}
            accessibilityLabel={`${lesson.title}. ${lesson.description}. ${lesson.difficulty}, ${lesson.estimatedMinutes} minutes.`}
          >
            <View style={styles.lessonText}>
              <Text style={[styles.lessonTitle, { color: theme.colors.text, fontSize: 16 * settings.fontScale }]}>{lesson.title}</Text>
              <Text style={[styles.lessonMeta, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>
                {lesson.language} · {lesson.difficulty} · ~{lesson.estimatedMinutes} min · {lessonProgress(lesson.id)}% accuracy
              </Text>
            </View>
            <View style={styles.lessonActions}>
              <AccessibleButton title="Learn" size="sm" onPress={() => router.push(`/lesson/${lesson.id}`)} />
              <AccessibleButton title="Practice" size="sm" variant="success" onPress={() => router.push(`/practice/${lesson.id}`)} />
            </View>
          </View>
        ))}
      </Card>

      <Card title="Badges">
        <View style={styles.badgeGrid}>
          {BADGES.map((b) => {
            const earned = earnedIds.has(b.id);
            return (
              <View
                key={b.id}
                accessibilityLabel={`${b.title}. ${b.description}. ${earned ? 'Earned.' : 'Not yet earned.'}`}
                style={[
                  styles.badge,
                  {
                    backgroundColor: earned ? theme.colors.success : theme.colors.surfaceElevated,
                    borderColor: earned ? theme.colors.success : theme.colors.border,
                  },
                ]}
              >
                <Text style={styles.badgeIcon}>{b.icon}</Text>
                <Text
                  style={[styles.badgeTitle, { color: earned ? '#fff' : theme.colors.text, fontSize: 13 * settings.fontScale }]}
                >
                  {b.title}
                </Text>
                <Text
                  style={[styles.badgeDesc, { color: earned ? '#EAF8EF' : theme.colors.textMuted, fontSize: 11 * settings.fontScale }]}
                >
                  {b.description}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  text: {},
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  lessonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderTopWidth: 1, paddingVertical: 12 },
  lessonText: { flex: 1 },
  lessonTitle: { fontWeight: '700' },
  lessonMeta: {},
  lessonActions: { gap: 6 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: { width: '48%', padding: 12, borderRadius: 14, borderWidth: 1, gap: 4 },
  badgeIcon: { fontSize: 24 },
  badgeTitle: { fontWeight: '700' },
  badgeDesc: {},
});
