import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { AccessibleButton } from '@/components/AccessibleButton';
import { SignAvatar } from '@/components/SignAvatar';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { letterCues } from '@/utils/gloss';
import { speak } from '@/services/voice/tts';

type Range = '0-10' | '0-20' | '0-100';

function randomNum(range: Range): number {
  const max = range === '0-10' ? 10 : range === '0-20' ? 20 : 100;
  return Math.floor(Math.random() * (max + 1));
}

export default function NumbersTrainer() {
  const { theme, settings, haptic, announce } = useAccessibility();
  const { addXp, pingActivity } = useUserProfile();
  const [range, setRange] = useState<Range>('0-10');
  const [n, setN] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const cues = useMemo(() => letterCues(String(n).padStart(1, '0')), [n]);

  const start = () => {
    setRunning(true);
    setSecondsLeft(30);
    setScore(0);
    setStreak(0);
    setN(randomNum(range));
    announce('Time attack started. You have 30 seconds.');
    haptic('medium');
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          haptic('warning');
          speak('Time is up.');
          setRunning(false);
          pingActivity();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const registerCorrect = useCallback(() => {
    haptic('success');
    setScore((s) => s + 1);
    setStreak((s) => s + 1);
    addXp(2);
    setN(randomNum(range));
  }, [addXp, haptic, range]);

  const registerWrong = useCallback(() => {
    haptic('error');
    setStreak(0);
    setN(randomNum(range));
  }, [haptic, range]);

  return (
    <Screen>
      <Text style={[styles.heading, { color: theme.colors.text, fontSize: 24 * settings.fontScale }]}>Number practice</Text>
      <Text style={[styles.sub, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>
        Sign the number shown by the avatar. In time-attack mode, beat the clock.
      </Text>

      <View style={styles.row}>
        {(['0-10', '0-20', '0-100'] as Range[]).map((r) => (
          <Chip key={r} label={r} selected={range === r} onPress={() => setRange(r)} />
        ))}
      </View>

      <Card title={`Current: ${n}`} subtitle={running ? `⏱ ${secondsLeft}s  · Score ${score}  · Streak ${streak}` : undefined}>
        <SignAvatar
          cues={cues}
          speed={settings.signingSpeed}
          skinTone={settings.avatarSkinTone}
          style={settings.avatarStyle}
        />
        {running ? (
          <View style={styles.row}>
            <AccessibleButton title="I signed it" variant="success" onPress={registerCorrect} />
            <AccessibleButton title="Skip" variant="secondary" onPress={registerWrong} />
          </View>
        ) : (
          <View style={styles.row}>
            <AccessibleButton title="Start 30-second time attack" variant="primary" onPress={start} />
            <AccessibleButton title="Next number" variant="ghost" onPress={() => setN(randomNum(range))} />
          </View>
        )}
      </Card>

      <Card title="Tips">
        <Text style={{ color: theme.colors.text, fontSize: 14 * settings.fontScale }}>
          Palm orientation matters. Numbers 1–5 face the signer; 6–10 flip to face the listener. For bigger numbers, sign each digit in order.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontWeight: '800' },
  sub: { marginTop: 2, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 6 },
});
