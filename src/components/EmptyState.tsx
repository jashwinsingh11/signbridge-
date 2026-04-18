import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAccessibility } from '@/context/AccessibilityContext';

interface Props {
  icon?: string;
  title: string;
  description?: string;
}

export function EmptyState({ icon = '·', title, description }: Props) {
  const { theme, settings } = useAccessibility();
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`${title}. ${description ?? ''}`}>
      <View style={[styles.icon, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
        <Text style={[styles.iconText, { color: theme.colors.textMuted, fontSize: 30 * settings.fontScale }]}>{icon}</Text>
      </View>
      <Text style={[styles.title, { color: theme.colors.text, fontSize: 16 * settings.fontScale }]}>{title}</Text>
      {description ? (
        <Text style={[styles.desc, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8, padding: 24 },
  icon: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontWeight: '700' },
  title: { fontWeight: '700', textAlign: 'center' },
  desc: { textAlign: 'center' },
});
