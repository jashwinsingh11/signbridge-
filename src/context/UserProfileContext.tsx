import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Badge, CustomGesture, PracticeAttempt, UserProfile } from '@/types';
import { BADGES } from '@/data/lessons';
import { loadJSON, saveJSON, StorageKeys } from '@/services/storage';

const DEFAULT_PROFILE: UserProfile = {
  id: 'local-user',
  displayName: 'You',
  preferredSignLanguage: 'ASL',
  preferredSpokenLocale: 'en-US',
  badges: [],
  practiceHistory: [],
  customGestures: [],
  vocabularyFrequency: {},
};

interface UserProfileContextValue {
  profile: UserProfile;
  update: (patch: Partial<UserProfile>) => void;
  recordAttempt: (attempt: PracticeAttempt) => void;
  addCustomGesture: (gesture: CustomGesture) => void;
  removeCustomGesture: (id: string) => void;
  earnBadge: (badgeId: string) => Badge | null;
  trackVocabulary: (gloss: string) => void;
  topVocabulary: (n?: number) => { gloss: string; count: number }[];
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadJSON<UserProfile>(StorageKeys.userProfile, DEFAULT_PROFILE).then((loadedProfile) => {
      setProfile({ ...DEFAULT_PROFILE, ...loadedProfile });
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveJSON(StorageKeys.userProfile, profile);
  }, [profile, loaded]);

  const update = useCallback((patch: Partial<UserProfile>) => {
    setProfile((p) => ({ ...p, ...patch }));
  }, []);

  const recordAttempt = useCallback((attempt: PracticeAttempt) => {
    setProfile((p) => ({
      ...p,
      practiceHistory: [...p.practiceHistory.slice(-499), attempt],
    }));
  }, []);

  const addCustomGesture = useCallback((gesture: CustomGesture) => {
    setProfile((p) => ({ ...p, customGestures: [...p.customGestures, gesture] }));
  }, []);

  const removeCustomGesture = useCallback((id: string) => {
    setProfile((p) => ({ ...p, customGestures: p.customGestures.filter((g) => g.id !== id) }));
  }, []);

  const earnBadge = useCallback((badgeId: string): Badge | null => {
    const meta = BADGES.find((b) => b.id === badgeId);
    if (!meta) return null;
    let emitted: Badge | null = null;
    setProfile((p) => {
      if (p.badges.some((b) => b.id === badgeId)) return p;
      const earned: Badge = { ...meta, earnedAt: Date.now() };
      emitted = earned;
      return { ...p, badges: [...p.badges, earned] };
    });
    return emitted;
  }, []);

  const trackVocabulary = useCallback((gloss: string) => {
    if (!gloss) return;
    setProfile((p) => ({
      ...p,
      vocabularyFrequency: {
        ...p.vocabularyFrequency,
        [gloss]: (p.vocabularyFrequency[gloss] ?? 0) + 1,
      },
    }));
  }, []);

  const topVocabulary = useCallback(
    (n = 10) => {
      return Object.entries(profile.vocabularyFrequency)
        .map(([gloss, count]) => ({ gloss, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, n);
    },
    [profile.vocabularyFrequency],
  );

  const value = useMemo<UserProfileContextValue>(
    () => ({ profile, update, recordAttempt, addCustomGesture, removeCustomGesture, earnBadge, trackVocabulary, topVocabulary }),
    [profile, update, recordAttempt, addCustomGesture, removeCustomGesture, earnBadge, trackVocabulary, topVocabulary],
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used inside UserProfileProvider');
  return ctx;
}
