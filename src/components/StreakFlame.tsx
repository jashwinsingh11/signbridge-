import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAccessibility } from '@/context/AccessibilityContext';

export function StreakFlame({ streak }: { streak: number }) {
  const { theme, settings } = useAccessibility();
  const color = streak >= 30 ? theme.colors.accent : streak >= 7 ? theme.colors.primary : theme.colors.warning;
  return (
    <View
      accessibilityLabel={`Current streak: ${streak} ${streak === 1 ? 'day' : 'days'}.`}
      style={[styles.pill, { borderColor: color }]}
    >
      <Text style={[styles.icon, { fontSize: 16 * settings.fontScale }]}>🔥</Text>
      <Text style={[styles.text, { color: theme.colors.text, fontSize: 14 * settings.fontScale }]}>
        {streak}-day streak
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  icon: {},
  text: { fontWeight: '700' },
});
