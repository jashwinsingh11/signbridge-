import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { AccessibleButton } from '@/components/AccessibleButton';
import { SignAvatar } from '@/components/SignAvatar';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { letterCues } from '@/utils/gloss';
import { speak } from '@/services/voice/tts';

const STARTER_WORDS = [
  'HELLO', 'WORLD', 'FAMILY', 'COFFEE', 'PLEASE',
  'THANK', 'SCHOOL', 'HAPPY', 'WATER', 'DOCTOR',
];

export default function FingerspellTrainer() {
  const { theme, settings, haptic, announce } = useAccessibility();
  const { addXp, earnBadge, pingActivity } = useUserProfile();
  const [word, setWord] = useState('HELLO');
  const [mode, setMode] = useState<'practice' | 'quiz'>('practice');
  const [revealed, setRevealed] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);

  const cues = useMemo(() => letterCues(word), [word]);

  const onCueChange = useCallback((_: unknown, index: number) => {
    setCurrentIdx(Math.min(index, cues.length - 1));
  }, [cues.length]);

  const start = (next: string) => {
    setWord(next);
    setRevealed(false);
    setCurrentIdx(0);
    haptic('light');
    announce(`Fingerspelling ${next}`);
  };

  const submitCorrect = () => {
    haptic('success');
    speak('Nice work.');
    setCorrect((c) => c + 1);
    addXp(5);
    pingActivity();
    if (correct + 1 >= 3) earnBadge('badge-fingerspell');
    // next word
    const next = STARTER_WORDS[(STARTER_WORDS.indexOf(word) + 1 + STARTER_WORDS.length) % STARTER_WORDS.length];
    start(next);
  };

  const submitTryAgain = () => {
    haptic('warning');
    setRevealed(true);
    announce('Keep trying. Watch the avatar once more.');
  };

  return (
    <Screen>
      <Text style={[styles.heading, { color: theme.colors.text, fontSize: 24 * settings.fontScale }]}>Fingerspelling trainer</Text>
      <Text style={[styles.sub, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>
        Sign each letter as the avatar moves through it.
      </Text>

      <View style={styles.row}>
        <Chip label="Practice" selected={mode === 'practice'} onPress={() => setMode('practice')} />
        <Chip label="Quiz" selected={mode === 'quiz'} onPress={() => setMode('quiz')} />
      </View>

      {mode === 'practice' ? (
        <Card title="Type any word" subtitle="The avatar spells it out, letter by letter.">
          <TextInput
            value={word}
            onChangeText={(t) => setWord(t.toUpperCase().replace(/[^A-Z]/g, ''))}
            accessibilityLabel="Word to fingerspell"
            autoCapitalize="characters"
            style={[
              styles.input,
              {
                color: theme.colors.text,
                backgroundColor: theme.colors.surfaceElevated,
                borderColor: theme.colors.border,
                fontSize: 18 * settings.fontScale,
              },
            ]}
          />
          <View style={styles.rowWrap}>
            {STARTER_WORDS.map((w) => (
              <Chip key={w} label={w} selected={w === word} onPress={() => start(w)} />
            ))}
          </View>
        </Card>
      ) : (
        <Card title="Quiz mode" subtitle="Guess the word from the avatar. Reveal if stuck.">
          <Text style={[styles.bigWord, { color: theme.colors.text, fontSize: 32 * settings.fontScale }]}>
            {revealed ? word : '• • • • •'.slice(0, word.length * 2 - 1)}
          </Text>
          <View style={styles.row}>
            <AccessibleButton title="Reveal" variant="ghost" onPress={() => setRevealed((r) => !r)} />
            <AccessibleButton title="I got it" variant="success" onPress={submitCorrect} />
            <AccessibleButton title="Try again" variant="secondary" onPress={submitTryAgain} />
          </View>
        </Card>
      )}

      <Card title={`Letter ${Math.min(currentIdx + 1, cues.length)} of ${cues.length}`}>
        <SignAvatar
          cues={cues}
          speed={settings.signingSpeed}
          skinTone={settings.avatarSkinTone}
          style={settings.avatarStyle}
          onCueChange={onCueChange}
        />
        <Text style={[styles.caption, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>
          Correct so far: {correct}
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontWeight: '800' },
  sub: { marginTop: 2, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  bigWord: { fontWeight: '900', textAlign: 'center', letterSpacing: 4 },
  caption: { marginTop: 8 },
});
