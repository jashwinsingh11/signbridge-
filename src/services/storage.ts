import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  accessibilitySettings: '@signbridge/accessibility',
  userProfile: '@signbridge/profile',
  conversations: '@signbridge/conversations',
  practiceHistory: '@signbridge/practice',
  customGestures: '@signbridge/custom_gestures',
  vocabulary: '@signbridge/vocab',
  onboarded: '@signbridge/onboarded',
} as const;

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // swallow: storage errors are non-fatal for UX
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    /* noop */
  }
}
