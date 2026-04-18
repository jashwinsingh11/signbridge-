import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useAccessibility } from '@/context/AccessibilityContext';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  accessibilityHint?: string;
}

export function Chip({ label, selected, onPress, accessibilityHint }: Props) {
  const { theme, settings, haptic } = useAccessibility();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: !!selected }}
      accessibilityHint={accessibilityHint}
      onPress={() => {
        haptic('selection');
        onPress?.();
      }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.colors.primary : theme.colors.surfaceElevated,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: selected ? theme.colors.primaryContrast : theme.colors.text,
            fontSize: 14 * settings.fontScale,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  label: { fontWeight: '600' },
});
