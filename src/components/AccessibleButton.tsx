import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';

import { useAccessibility } from '@/context/AccessibilityContext';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress: () => void;
  accessibilityHint?: string;
  accessibilityLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  hapticPattern?: 'light' | 'medium' | 'heavy' | 'selection' | 'success';
  style?: ViewStyle;
}

export function AccessibleButton({
  title,
  onPress,
  accessibilityHint,
  accessibilityLabel,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  leftIcon,
  rightIcon,
  hapticPattern = 'selection',
  style,
}: Props) {
  const { theme, haptic, settings } = useAccessibility();

  const styles = useMemo(() => buildStyles(theme, settings.fontScale), [theme, settings.fontScale]);

  const colors = {
    primary: { bg: theme.colors.primary, fg: theme.colors.primaryContrast, border: theme.colors.primary },
    secondary: { bg: theme.colors.surfaceElevated, fg: theme.colors.text, border: theme.colors.border },
    ghost: { bg: 'transparent', fg: theme.colors.text, border: 'transparent' },
    danger: { bg: theme.colors.danger, fg: '#FFFFFF', border: theme.colors.danger },
    success: { bg: theme.colors.success, fg: '#FFFFFF', border: theme.colors.success },
  }[variant];

  const sizeStyles: { container: ViewStyle; text: TextStyle } =
    size === 'sm'
      ? { container: { paddingVertical: 8, paddingHorizontal: 14, minHeight: 40 }, text: { fontSize: 14 * settings.fontScale } }
      : size === 'lg'
      ? { container: { paddingVertical: 18, paddingHorizontal: 24, minHeight: 60 }, text: { fontSize: 20 * settings.fontScale } }
      : { container: { paddingVertical: 12, paddingHorizontal: 18, minHeight: 48 }, text: { fontSize: 16 * settings.fontScale } };

  return (
    <Pressable
      onPress={() => {
        if (disabled || loading) return;
        haptic(hapticPattern);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        sizeStyles.container,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.fg} />
      ) : (
        <View style={styles.row}>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <Text style={[styles.text, sizeStyles.text, { color: colors.fg }]}>{title}</Text>
          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

function buildStyles(_theme: ReturnType<typeof useAccessibility>['theme'], _scale: number) {
  return StyleSheet.create({
    base: {
      borderRadius: 14,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    icon: { marginHorizontal: 4 },
    text: { fontWeight: '600', textAlign: 'center' },
  });
}
