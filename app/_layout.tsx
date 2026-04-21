import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';

import { AccessibilityProvider, useAccessibility } from '@/context/AccessibilityContext';
import { UserProfileProvider, useUserProfile } from '@/context/UserProfileContext';
import { ConversationProvider } from '@/context/ConversationContext';
import { VoiceCommandBar } from '@/components/VoiceCommandBar';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootNavigator() {
  const { theme } = useAccessibility();
  const { profile } = useUserProfile();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch(() => undefined);
    SplashScreen.hideAsync().catch(() => undefined);
  }, [theme.colors.background]);

  useEffect(() => {
    const current = segments.join('/');
    if (!profile.onboardingCompleted && current !== 'onboarding') {
      router.replace('/onboarding');
    }
  }, [profile.onboardingCompleted, segments, router]);

  return (
    <>
      <StatusBar style={theme.mode === 'light' ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTitleStyle: { color: theme.colors.text },
          headerTintColor: theme.colors.text,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="lesson/[id]" options={{ title: 'Lesson' }} />
        <Stack.Screen name="practice/[id]" options={{ title: 'Practice' }} />
        <Stack.Screen name="conversation/[id]" options={{ title: 'Conversation' }} />
        <Stack.Screen name="dictionary" options={{ title: 'Dictionary' }} />
        <Stack.Screen name="dictionary/[id]" options={{ title: 'Entry' }} />
        <Stack.Screen name="fingerspell" options={{ title: 'Fingerspelling' }} />
        <Stack.Screen name="numbers" options={{ title: 'Numbers' }} />
        <Stack.Screen name="handshapes" options={{ title: 'Handshapes' }} />
        <Stack.Screen name="stats" options={{ title: 'Stats' }} />
      </Stack>
      <VoiceCommandBar />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AccessibilityProvider>
          <UserProfileProvider>
            <ConversationProvider>
              <RootNavigator />
            </ConversationProvider>
          </UserProfileProvider>
        </AccessibilityProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
