import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAccessibility } from '@/context/AccessibilityContext';

interface Props {
  level: number;
  current: number;
  next: number;
  compact?: boolean;
}

export function XpBar({ level, current, next, compact }: Props) {
  const { theme, settings } = useAccessibility();
  const pct = Math.max(0, Math.min(1, current / next));
  return (
    <View
      accessibilityLabel={`Level ${level}. ${current} of ${next} experience points toward the next level.`}
      style={[styles.wrap, compact && styles.compact]}
    >
      <View style={styles.row}>
        <Text style={[styles.level, { color: theme.colors.text, fontSize: (compact ? 13 : 15) * settings.fontScale }]}>
          Level {level}
        </Text>
        <Text style={[styles.xp, { color: theme.colors.textMuted, fontSize: (compact ? 11 : 13) * settings.fontScale }]}>
          {current} / {next} XP
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: theme.colors.primary,
              width: `${pct * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  compact: { gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  level: { fontWeight: '800' },
  xp: {},
  track: { height: 10, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
});
