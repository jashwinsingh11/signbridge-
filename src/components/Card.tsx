import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { useAccessibility } from '@/context/AccessibilityContext';

interface Props {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function Card({ title, subtitle, children, style, accessibilityLabel }: Props) {
  const { theme, settings } = useAccessibility();
  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={accessibilityLabel ?? title}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        style,
      ]}
    >
      {title ? (
        <Text style={[styles.title, { color: theme.colors.text, fontSize: 18 * settings.fontScale }]}>{title}</Text>
      ) : null}
      {subtitle ? (
        <Text style={[styles.subtitle, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>{subtitle}</Text>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  title: { fontWeight: '700' },
  subtitle: {},
  body: { marginTop: 4, gap: 8 },
});
