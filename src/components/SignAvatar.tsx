import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

import { useAccessibility } from '@/context/AccessibilityContext';
import type { AvatarAnimationCue } from '@/types';

interface Props {
  cues: AvatarAnimationCue[];
  speed?: number;
  skinTone?: 'light' | 'medium' | 'dark';
  style?: 'classic' | 'modern' | 'minimal';
  onCueChange?: (cue: AvatarAnimationCue | null, index: number) => void;
}

/**
 * A lightweight 2D stand-in for the 3D signing avatar. It plays back a
 * sequence of "cues" (gloss + duration + handshape) using reanimated.
 * The rendering surface is intentionally decoupled so a real rig (e.g.
 * glTF/Three.js via `react-three-fiber`) can be dropped in place of the
 * body shapes without changing the cue protocol.
 */
export function SignAvatar({ cues, speed = 1, skinTone = 'medium', style = 'modern', onCueChange }: Props) {
  const { theme, settings } = useAccessibility();
  const [active, setActive] = useState<AvatarAnimationCue | null>(cues[0] ?? null);
  const [idx, setIdx] = useState(0);

  const swing = useSharedValue(0);
  const bob = useSharedValue(0);

  useEffect(() => {
    if (settings.reduceMotion) {
      swing.value = 0;
      bob.value = 0;
      return;
    }
    swing.value = withRepeat(
      withSequence(withTiming(1, { duration: 600 / speed, easing: Easing.inOut(Easing.ease) }), withTiming(-1, { duration: 600 / speed, easing: Easing.inOut(Easing.ease) })),
      -1,
      true,
    );
    bob.value = withRepeat(withTiming(1, { duration: 900 / speed, easing: Easing.inOut(Easing.ease) }), -1, true);
    return () => {
      cancelAnimation(swing);
      cancelAnimation(bob);
    };
  }, [speed, settings.reduceMotion, swing, bob]);

  useEffect(() => {
    if (cues.length === 0) return;
    let cancelled = false;
    setIdx(0);
    setActive(cues[0]);
    onCueChange?.(cues[0], 0);

    async function play() {
      for (let i = 0; i < cues.length && !cancelled; i++) {
        setIdx(i);
        setActive(cues[i]);
        onCueChange?.(cues[i], i);
        const dur = Math.max(200, cues[i].durationMs / Math.max(0.25, speed));
        await new Promise((resolve) => setTimeout(resolve, dur));
      }
      if (!cancelled) {
        setActive(null);
        onCueChange?.(null, cues.length);
      }
    }
    void play();
    return () => {
      cancelled = true;
    };
  }, [cues, speed, onCueChange]);

  const skin = SKIN[skinTone];
  const palette = useMemo(
    () => ({
      body: style === 'classic' ? theme.colors.primary : style === 'minimal' ? theme.colors.surfaceElevated : theme.colors.accent,
      outline: theme.colors.border,
    }),
    [theme, style],
  );

  const leftArm = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-30 + swing.value * 45}deg` }],
  }));
  const rightArm = useAnimatedStyle(() => ({
    transform: [{ rotate: `${30 - swing.value * 45}deg` }],
  }));
  const head = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value * -2 }],
  }));

  return (
    <View
      accessible
      accessibilityLabel={active ? `Signing ${active.gloss}` : 'Signing avatar idle'}
      accessibilityRole="image"
      style={[styles.stage, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
    >
      <View style={styles.avatar}>
        <Animated.View style={[styles.head, { backgroundColor: skin, borderColor: palette.outline }, head]} />
        <View style={[styles.torso, { backgroundColor: palette.body, borderColor: palette.outline }]}>
          <Animated.View style={[styles.arm, styles.left, { backgroundColor: skin, borderColor: palette.outline }, leftArm]} />
          <Animated.View style={[styles.arm, styles.right, { backgroundColor: skin, borderColor: palette.outline }, rightArm]} />
        </View>
      </View>
      <View style={styles.caption} pointerEvents="none">
        <Text style={[styles.gloss, { color: theme.colors.text }]}>
          {active ? active.gloss : '—'}
        </Text>
        {active?.phonetic ? (
          <Text style={[styles.phonetic, { color: theme.colors.textMuted }]}>{active.phonetic}</Text>
        ) : null}
        <Text style={[styles.counter, { color: theme.colors.textMuted }]}>
          {cues.length > 0 ? `${Math.min(idx + 1, cues.length)} / ${cues.length}` : ''}
        </Text>
      </View>
    </View>
  );
}

const SKIN = {
  light: '#F1D6BC',
  medium: '#C89476',
  dark: '#6F4432',
};

const styles = StyleSheet.create({
  stage: { height: 320, borderRadius: 24, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatar: { alignItems: 'center', justifyContent: 'flex-end', height: 220, width: 160 },
  head: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, marginBottom: 6 },
  torso: {
    width: 130,
    height: 140,
    borderRadius: 32,
    borderWidth: 2,
    position: 'relative',
  },
  arm: {
    position: 'absolute',
    top: 18,
    width: 26,
    height: 110,
    borderRadius: 14,
    borderWidth: 2,
  },
  left: { left: -18, transformOrigin: 'top center' as unknown as undefined },
  right: { right: -18, transformOrigin: 'top center' as unknown as undefined },
  caption: { position: 'absolute', bottom: 12, alignItems: 'center' },
  gloss: { fontSize: 20, fontWeight: '800' },
  phonetic: { fontSize: 14, marginTop: 2 },
  counter: { fontSize: 12, marginTop: 2 },
});
