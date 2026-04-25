import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAccessibility } from '@/context/AccessibilityContext';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
}

export function Screen({ children, scroll = true, padded = true, style, contentStyle }: Props) {
  const { theme } = useAccessibility();
  const Container = scroll ? ScrollView : View;
  const containerProps = scroll
    ? { contentContainerStyle: [padded && styles.padded, contentStyle] }
    : { style: [styles.fill, padded && styles.padded, contentStyle] };
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }, style]} edges={['top', 'left', 'right']}>
      <Container {...(containerProps as Record<string, unknown>)}>{children}</Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  fill: { flex: 1 },
  padded: { padding: 16, gap: 16 },
});
