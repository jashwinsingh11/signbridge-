import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { AccessibleButton } from '@/components/AccessibleButton';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { useSignDetection } from '@/hooks/useSignDetection';
import { lessonById } from '@/data/lessons';
import { MockClassifier } from '@/services/signClassifier';
import type { DetectedSign, PracticeAttempt } from '@/types';

export default function PracticeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme, settings, announce, haptic, describe } = useAccessibility();
  const { recordAttempt, earnBadge, addXp, markLessonComplete, pingActivity, profile } = useUserProfile();
  const [permission, requestPermission] = useCameraPermissions();
  const lesson = useMemo(() => (typeof id === 'string' ? lessonById(id) : undefined), [id]);
  const [stepIdx, setStepIdx] = useState(0);
  const [results, setResults] = useState<PracticeAttempt[]>([]);
  const completedRef = useRef(false);
  const profileSnapshot = useRef(profile);
  useEffect(() => {
    profileSnapshot.current = profile;
  }, [profile]);

  const onDetect = useCallback(
    (sign: DetectedSign) => {
      if (!lesson) return;
      const step = lesson.steps[stepIdx];
      if (!step) return;
      const normalize = (s: string) => s.toUpperCase().replace(/[\s-]/g, '');
      const expected = normalize(step.gloss);
      const got = normalize(sign.gloss);
      if (got.includes(expected) || expected.includes(got)) {
        const attempt: PracticeAttempt = {
          lessonId: lesson.id,
          stepId: step.id,
          gloss: step.gloss,
          confidence: sign.confidence,
          correct: true,
          timestampMs: Date.now(),
        };
        setResults((r) => [...r, attempt]);
        recordAttempt(attempt);
        haptic('success');
        describe(`Nice. You signed ${step.gloss.replace(/-/g, ' ')}.`);
        setStepIdx((i) => i + 1);
      }
    },
    [lesson, stepIdx, recordAttempt, haptic, describe],
  );

  const detection = useSignDetection(lesson?.language ?? 'ASL', onDetect);

  useEffect(() => {
    if (lesson) detection.setClassifier(new MockClassifier(lesson.language));
  }, [lesson?.language]);

  useEffect(() => {
    if (!lesson) return;
    if (stepIdx < lesson.steps.length) return;
    if (completedRef.current) return;
    completedRef.current = true;
    detection.stop();
    const correct = results.filter((r) => r.correct).length;
    const accuracy = Math.round((correct / Math.max(1, lesson.steps.length)) * 100);
    const snapshot = profileSnapshot.current;
    const xpGained = 15 + correct * 2;
    announce(`Practice complete. ${accuracy} percent accuracy.`, { speak: true });
    haptic('success');
    markLessonComplete(lesson.id, lesson.language);
    addXp(xpGained);
    pingActivity();
    earnBadge('badge-first-lesson');
    if (accuracy >= 90) earnBadge('badge-accuracy');
    if (accuracy === 100) earnBadge('badge-perfect');
    const completedCount = snapshot.completedLessonIds.length + 1;
    if (completedCount >= 5) earnBadge('badge-five-lessons');
    if (completedCount >= 10) earnBadge('badge-ten-lessons');
    const languages = new Set(Object.keys(snapshot.lessonsPracticedByLanguage));
    languages.add(lesson.language);
    if (languages.size >= 2) earnBadge('badge-polyglot');
    if (languages.size >= 3) earnBadge('badge-triglot');
    if (snapshot.xp + xpGained >= 100) earnBadge('badge-xp-100');
    if (snapshot.xp + xpGained >= 500) earnBadge('badge-xp-500');
    if (snapshot.streakDays >= 3) earnBadge('badge-daily-3');
    if (snapshot.streakDays >= 7) earnBadge('badge-daily-7');
    if (snapshot.streakDays >= 30) earnBadge('badge-daily-30');
  }, [stepIdx, lesson, detection, results, announce, haptic, earnBadge, addXp, markLessonComplete, pingActivity]);

  if (!lesson) {
    return (
      <Screen>
        <Card title="Lesson not found">
          <AccessibleButton title="Back" onPress={() => router.replace('/learn')} />
        </Card>
      </Screen>
    );
  }

  if (!permission?.granted) {
    return (
      <Screen>
        <Card title="Camera permission needed">
          <AccessibleButton title="Grant camera access" onPress={() => requestPermission()} />
        </Card>
      </Screen>
    );
  }

  const currentStep = lesson.steps[stepIdx];
  const done = stepIdx >= lesson.steps.length;

  return (
    <Screen scroll>
      <Card
        title={done ? 'Complete' : `Sign: ${currentStep.gloss}`}
        subtitle={done ? 'You finished this practice set.' : currentStep.instruction}
      />

      <View style={[styles.preview, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
        {Platform.OS !== 'web' ? (
          <CameraView style={StyleSheet.absoluteFillObject} facing="front" />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, styles.webFallback]}>
            <Text style={{ color: theme.colors.textMuted }}>Camera preview is only available on native devices.</Text>
          </View>
        )}
        <View style={styles.overlay} pointerEvents="none">
          {!done ? (
            <View style={[styles.overlayPill, { backgroundColor: theme.colors.overlay }]}>
              <Text style={styles.overlayText}>Next: {currentStep.gloss}</Text>
            </View>
          ) : null}
          {detection.latest && !done ? (
            <View style={[styles.overlayPill, { backgroundColor: theme.colors.overlay, alignSelf: 'center' }]}>
              <Text style={styles.overlayText}>
                {detection.latest.gloss} · {Math.round(detection.latest.confidence * 100)}%
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {!done ? (
        <Card title="Detection">
          {detection.latest ? (
            <ConfidenceBar confidence={detection.latest.confidence} label={detection.latest.gloss} />
          ) : (
            <Text style={[styles.subtle, { color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }]}>
              Waiting for your sign…
            </Text>
          )}
          <View style={styles.row}>
            <AccessibleButton
              title={detection.running ? 'Pause' : 'Start practice'}
              variant={detection.running ? 'danger' : 'primary'}
              onPress={() => (detection.running ? detection.stop() : detection.start())}
              style={styles.flex1}
            />
            <AccessibleButton
              title="Skip"
              variant="ghost"
              onPress={() => {
                const attempt: PracticeAttempt = {
                  lessonId: lesson.id,
                  stepId: currentStep.id,
                  gloss: currentStep.gloss,
                  confidence: 0,
                  correct: false,
                  timestampMs: Date.now(),
                };
                setResults((r) => [...r, attempt]);
                recordAttempt(attempt);
                haptic('warning');
                setStepIdx((i) => i + 1);
              }}
            />
          </View>
        </Card>
      ) : (
        <Card title="Results">
          {lesson.steps.map((s, i) => {
            const attempt = results.find((r) => r.stepId === s.id);
            return (
              <View key={s.id} style={styles.resultRow}>
                <Text style={[styles.resultStep, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>
                  {i + 1}. {s.gloss}
                </Text>
                <Text
                  style={[
                    styles.resultStatus,
                    { color: attempt?.correct ? theme.colors.success : theme.colors.danger, fontSize: 13 * settings.fontScale },
                  ]}
                >
                  {attempt?.correct ? `✓ ${Math.round((attempt.confidence ?? 0) * 100)}%` : '—'}
                </Text>
              </View>
            );
          })}
          <View style={styles.row}>
            <AccessibleButton
              title="Again"
              variant="primary"
              onPress={() => {
                completedRef.current = false;
                setStepIdx(0);
                setResults([]);
                detection.reset();
                detection.start();
              }}
              style={styles.flex1}
            />
            <AccessibleButton title="Back to lessons" variant="ghost" onPress={() => router.replace('/learn')} style={styles.flex1} />
          </View>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: { height: 280, borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  webFallback: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 12 },
  overlayPill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  overlayText: { color: '#fff', fontWeight: '700' },
  subtle: {},
  row: { flexDirection: 'row', gap: 10 },
  flex1: { flex: 1 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  resultStep: { fontWeight: '600' },
  resultStatus: { fontWeight: '700' },
});
