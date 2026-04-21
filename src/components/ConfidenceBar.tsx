import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAccessibility } from '@/context/AccessibilityContext';

interface Props {
  confidence: number;
  label?: string;
}

export function ConfidenceBar({ confidence, label }: Props) {
  const { theme, settings } = useAccessibility();
  const pct = Math.max(0, Math.min(1, confidence));
  const color = pct > 0.8 ? theme.colors.success : pct > 0.5 ? theme.colors.warning : theme.colors.danger;
  const pctLabel = `${Math.round(pct * 100)}%`;
  return (
    <View
      accessible
      accessibilityLabel={label ? `${label}. Confidence ${pctLabel}.` : `Confidence ${pctLabel}.`}
      style={styles.wrapper}
    >
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>
          {label ?? 'Confidence'}
        </Text>
        <Text style={[styles.value, { color: theme.colors.text, fontSize: 12 * settings.fontScale }]}>{pctLabel}</Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: {},
  value: { fontWeight: '700' },
  track: { height: 8, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
});
