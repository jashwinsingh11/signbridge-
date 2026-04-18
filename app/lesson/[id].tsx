import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { SignAvatar } from '@/components/SignAvatar';
import { AccessibleButton } from '@/components/AccessibleButton';
import { useAccessibility } from '@/context/AccessibilityContext';
import { lessonById } from '@/data/lessons';
import { textToCues } from '@/utils/gloss';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme, settings, describe, announce, haptic } = useAccessibility();
  const lesson = useMemo(() => (typeof id === 'string' ? lessonById(id) : undefined), [id]);
  const [stepIdx, setStepIdx] = useState(0);

  if (!lesson) {
    return (
      <Screen>
        <Card title="Lesson not found">
          <AccessibleButton title="Back to lessons" onPress={() => router.replace('/learn')} />
        </Card>
      </Screen>
    );
  }

  const step = lesson.steps[stepIdx];
  const cues = textToCues(step.gloss, lesson.language);

  const goNext = () => {
    if (stepIdx + 1 >= lesson.steps.length) {
      announce('Lesson complete. Starting practice.', { speak: true });
      haptic('success');
      router.replace(`/practice/${lesson.id}`);
      return;
    }
    setStepIdx((i) => i + 1);
    haptic('light');
    describe(lesson.steps[stepIdx + 1].instruction);
  };

  return (
    <Screen>
      <Card title={lesson.title} subtitle={`${lesson.language} · ${lesson.difficulty} · ~${lesson.estimatedMinutes} min`}>
        <Text style={[styles.description, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>{lesson.description}</Text>
      </Card>

      <Card title={`Step ${stepIdx + 1} of ${lesson.steps.length}`} subtitle={step.gloss}>
        <SignAvatar
          cues={cues.length > 0 ? cues : [{ gloss: step.gloss, durationMs: 900, handshape: 'neutral', phonetic: step.phonetic }]}
          speed={settings.signingSpeed}
          skinTone={settings.avatarSkinTone}
          style={settings.avatarStyle}
        />
        <Text style={[styles.instruction, { color: theme.colors.text, fontSize: 16 * settings.fontScale }]}>{step.instruction}</Text>
        {step.tip ? (
          <Text style={[styles.tip, { color: theme.colors.accent, fontSize: 13 * settings.fontScale }]}>Tip: {step.tip}</Text>
        ) : null}
        {step.phonetic ? (
          <Text style={[styles.phonetic, { color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }]}>Phonetic: {step.phonetic}</Text>
        ) : null}
        <View style={styles.row}>
          <AccessibleButton
            title="Back"
            variant="ghost"
            disabled={stepIdx === 0}
            onPress={() => setStepIdx((i) => Math.max(0, i - 1))}
            style={styles.flex1}
          />
          <AccessibleButton
            title="Hear instruction"
            variant="secondary"
            onPress={() => describe(step.instruction)}
            style={styles.flex1}
          />
          <AccessibleButton
            title={stepIdx + 1 >= lesson.steps.length ? 'Practice' : 'Next'}
            variant="primary"
            onPress={goNext}
            style={styles.flex1}
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  description: {},
  instruction: { fontWeight: '500' },
  tip: {},
  phonetic: { fontStyle: 'italic' },
  row: { flexDirection: 'row', gap: 10 },
  flex1: { flex: 1 },
});
