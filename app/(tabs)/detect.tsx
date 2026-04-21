import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { AccessibleButton } from '@/components/AccessibleButton';
import { ConfidenceBar } from '@/components/ConfidenceBar';
import { Chip } from '@/components/Chip';
import { EmptyState } from '@/components/EmptyState';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { useConversations } from '@/context/ConversationContext';
import { useSignDetection } from '@/hooks/useSignDetection';
import { SIGN_LANGUAGES, signLanguageByCode } from '@/data/signLanguages';
import { MockClassifier } from '@/services/signClassifier';
import { speak, stopSpeaking } from '@/services/voice/tts';
import type { DetectedSign, SignLanguageCode } from '@/types';

export default function DetectScreen() {
  const { theme, settings, announce, haptic, describe } = useAccessibility();
  const { profile, trackVocabulary } = useUserProfile();
  const { activeId, startConversation, addTurn } = useConversations();
  const [permission, requestPermission] = useCameraPermissions();
  const [language, setLanguage] = useState<SignLanguageCode>(profile.preferredSignLanguage);
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [lastSpoken, setLastSpoken] = useState<string>('');

  const onDetect = useCallback(
    (sign: DetectedSign) => {
      if (sign.confidence < 0.65) return;
      haptic(sign.confidence > 0.85 ? 'success' : 'light');
      trackVocabulary(sign.gloss);
      if (sign.gloss !== lastSpoken) {
        describe(sign.gloss.replace(/-/g, ' '));
        setLastSpoken(sign.gloss);
      }
    },
    [haptic, trackVocabulary, describe, lastSpoken],
  );

  const detection = useSignDetection(language, onDetect);

  useEffect(() => {
    // Rebuild classifier when language changes.
    detection.setClassifier(new MockClassifier(language));
    detection.reset();
  }, [language]);

  useEffect(() => {
    if (permission?.granted) {
      announce('Camera is ready. Press start to begin sign detection.');
    }
  }, [permission?.granted, announce]);

  const currentLanguageName = useMemo(() => signLanguageByCode(language)?.name ?? language, [language]);
  const sentence = detection.sentence.join(' ').replace(/-/g, ' ');

  const saveToConversation = () => {
    if (!sentence) return;
    const id = activeId ?? startConversation('Detection session').id;
    addTurn(id, {
      speaker: 'me',
      mode: 'sign',
      text: sentence,
      gloss: detection.sentence.join(' '),
      language,
      confidence: detection.latest?.confidence ?? 0,
    });
    announce('Saved to conversation history.', { speak: true });
  };

  if (!permission) {
    return (
      <Screen>
        <EmptyState icon="…" title="Preparing camera…" />
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Card title="Camera permission needed" subtitle="SignBridge uses the camera to detect signs. Your video never leaves your device.">
          <AccessibleButton
            title="Grant camera access"
            variant="primary"
            onPress={() => {
              haptic('light');
              void requestPermission();
            }}
          />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={[styles.preview, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
        {Platform.OS !== 'web' ? (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            accessibilityLabel="Live camera preview for sign detection"
          />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, styles.webFallback]}>
            <Text style={{ color: theme.colors.textMuted }}>Camera preview is only available on native devices.</Text>
          </View>
        )}
        <View style={styles.overlay} pointerEvents="none">
          <View style={[styles.overlayTag, { backgroundColor: theme.colors.overlay }]}>
            <Text style={styles.overlayText}>{currentLanguageName}</Text>
            <Text style={styles.overlayText}>{detection.fps} fps</Text>
          </View>
          {detection.latest ? (
            <View style={[styles.detectionPill, { backgroundColor: theme.colors.overlay }]}>
              <Text style={styles.detectionGloss}>{detection.latest.gloss}</Text>
              <Text style={styles.detectionConf}>{Math.round(detection.latest.confidence * 100)}%</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Card title="Controls">
        <View style={styles.row}>
          <AccessibleButton
            title={detection.running ? 'Stop' : 'Start'}
            variant={detection.running ? 'danger' : 'primary'}
            size="lg"
            onPress={() => (detection.running ? detection.stop() : detection.start())}
            accessibilityHint={detection.running ? 'Stops sign detection' : 'Starts sign detection'}
            style={styles.flex1}
          />
          <AccessibleButton
            title="Reset"
            variant="ghost"
            size="lg"
            onPress={() => {
              detection.reset();
              setLastSpoken('');
              announce('Sentence cleared.');
            }}
          />
        </View>
        <View style={styles.row}>
          <AccessibleButton
            title={facing === 'front' ? 'Rear camera' : 'Front camera'}
            variant="secondary"
            onPress={() => setFacing((f) => (f === 'front' ? 'back' : 'front'))}
            style={styles.flex1}
          />
          <AccessibleButton
            title="Save to chat"
            variant="success"
            disabled={!sentence}
            onPress={saveToConversation}
            style={styles.flex1}
          />
        </View>
      </Card>

      <Card title="Sign language">
        <View style={styles.chipRow}>
          {SIGN_LANGUAGES.map((l) => (
            <Chip
              key={l.code}
              label={l.code}
              selected={language === l.code}
              onPress={() => setLanguage(l.code)}
              accessibilityHint={`Switch recognition to ${l.name}.`}
            />
          ))}
        </View>
      </Card>

      <Card title="Detection">
        {detection.latest ? (
          <>
            <Text
              style={[styles.detectedGloss, { color: theme.colors.text, fontSize: 28 * settings.fontScale }]}
              accessibilityLabel={`Detected sign ${detection.latest.gloss}`}
            >
              {detection.latest.gloss.replace(/-/g, ' ')}
            </Text>
            <ConfidenceBar confidence={detection.latest.confidence} label="Top match" />
            {detection.alternates.slice(0, 2).map((a) => (
              <View key={a.id} style={styles.altRow}>
                <Text style={[styles.altGloss, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>
                  {a.gloss.replace(/-/g, ' ')}
                </Text>
                <ConfidenceBar confidence={a.confidence} />
              </View>
            ))}
          </>
        ) : (
          <EmptyState icon="·" title="Press Start" description="Signs will appear here as they are recognized." />
        )}
      </Card>

      <Card title="Continuous sentence" subtitle="Buffered tokens. Reset to clear.">
        {sentence ? (
          <>
            <Text
              accessibilityLabel={`Current sentence: ${sentence}`}
              style={[styles.sentence, { color: theme.colors.text, fontSize: 18 * settings.fontScale }]}
            >
              {sentence}
            </Text>
            <View style={styles.row}>
              <AccessibleButton
                title="Speak sentence"
                variant="primary"
                onPress={() => {
                  haptic('light');
                  speak(sentence, { locale: profile.preferredSpokenLocale });
                }}
                style={styles.flex1}
              />
              <AccessibleButton
                title="Stop"
                variant="ghost"
                onPress={() => stopSpeaking()}
              />
            </View>
          </>
        ) : (
          <EmptyState icon="…" title="No sentence yet" description="Begin signing to build a sentence." />
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: { height: 360, borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  webFallback: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  overlay: { flex: 1, justifyContent: 'space-between', padding: 12 },
  overlayTag: { alignSelf: 'flex-start', flexDirection: 'row', gap: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  overlayText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  detectionPill: { alignSelf: 'center', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, alignItems: 'center' },
  detectionGloss: { color: '#fff', fontSize: 24, fontWeight: '800' },
  detectionConf: { color: '#fff', fontSize: 12, opacity: 0.9 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  flex1: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detectedGloss: { fontWeight: '800' },
  altRow: { gap: 4 },
  altGloss: {},
  sentence: { lineHeight: 24 },
});
