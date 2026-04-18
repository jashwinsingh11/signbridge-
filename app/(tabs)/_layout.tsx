import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { useAccessibility } from '@/context/AccessibilityContext';

function TabGlyph({ label, focused, color }: { label: string; focused: boolean; color: string }) {
  return (
    <Text accessibilityElementsHidden importantForAccessibility="no" style={{ color, fontSize: focused ? 22 : 18 }}>
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  const { theme } = useAccessibility();
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTitleStyle: { color: theme.colors.text },
        headerTintColor: theme.colors.text,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => <TabGlyph label="◎" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="detect"
        options={{
          title: 'Detect',
          tabBarIcon: ({ focused, color }) => <TabGlyph label="◉" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="speak"
        options={{
          title: 'Speak',
          tabBarIcon: ({ focused, color }) => <TabGlyph label="◐" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused, color }) => <TabGlyph label="◆" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Talk',
          tabBarIcon: ({ focused, color }) => <TabGlyph label="◇" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'You',
          tabBarIcon: ({ focused, color }) => <TabGlyph label="○" focused={focused} color={color} />,
        }}
      />
    </Tabs>
  );
}
