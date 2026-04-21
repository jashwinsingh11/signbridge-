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
  xp: 0,
  streakDays: 0,
  lastActiveDay: '',
  completedLessonIds: [],
  favoriteEntryIds: [],
  onboardingCompleted: false,
  lessonsPracticedByLanguage: {},
};

function todayKey(d: Date = new Date()): string {
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}

function daysBetween(a: string, b: string): number {
  if (!a || !b) return Infinity;
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const ta = Date.UTC(ay, am - 1, ad);
  const tb = Date.UTC(by, bm - 1, bd);
  return Math.round((tb - ta) / (1000 * 60 * 60 * 24));
}

export function xpToLevel(xp: number): { level: number; currentLevelXp: number; nextLevelXp: number } {
  // Progression: each level N requires 50*N XP cumulative from previous.
  let level = 1;
  let required = 50;
  let remaining = xp;
  while (remaining >= required) {
    remaining -= required;
    level += 1;
    required = 50 * level;
  }
  return { level, currentLevelXp: remaining, nextLevelXp: required };
}

interface UserProfileContextValue {
  profile: UserProfile;
  update: (patch: Partial<UserProfile>) => void;
  recordAttempt: (attempt: PracticeAttempt) => void;
  addCustomGesture: (gesture: CustomGesture) => void;
  removeCustomGesture: (id: string) => void;
  earnBadge: (badgeId: string) => Badge | null;
  trackVocabulary: (gloss: string) => void;
  topVocabulary: (n?: number) => { gloss: string; count: number }[];
  addXp: (amount: number) => void;
  pingActivity: () => void;
  markLessonComplete: (lessonId: string, language: string) => void;
  toggleFavorite: (entryId: string) => void;
  isFavorite: (entryId: string) => boolean;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
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

  const addXp = useCallback((amount: number) => {
    setProfile((p) => ({ ...p, xp: p.xp + Math.max(0, amount) }));
  }, []);

  const pingActivity = useCallback(() => {
    const today = todayKey();
    setProfile((p) => {
      if (p.lastActiveDay === today) return p;
      const gap = daysBetween(p.lastActiveDay, today);
      const nextStreak = gap === 1 ? p.streakDays + 1 : 1;
      return { ...p, lastActiveDay: today, streakDays: nextStreak };
    });
  }, []);

  const markLessonComplete = useCallback((lessonId: string, language: string) => {
    setProfile((p) => {
      const already = p.completedLessonIds.includes(lessonId);
      return {
        ...p,
        completedLessonIds: already ? p.completedLessonIds : [...p.completedLessonIds, lessonId],
        lessonsPracticedByLanguage: {
          ...p.lessonsPracticedByLanguage,
          [language]: (p.lessonsPracticedByLanguage[language] ?? 0) + 1,
        },
      };
    });
  }, []);

  const toggleFavorite = useCallback((entryId: string) => {
    setProfile((p) => {
      const has = p.favoriteEntryIds.includes(entryId);
      return {
        ...p,
        favoriteEntryIds: has ? p.favoriteEntryIds.filter((id) => id !== entryId) : [...p.favoriteEntryIds, entryId],
      };
    });
  }, []);

  const isFavorite = useCallback((entryId: string) => profile.favoriteEntryIds.includes(entryId), [profile.favoriteEntryIds]);

  const levelInfo = useMemo(() => xpToLevel(profile.xp), [profile.xp]);

  const value = useMemo<UserProfileContextValue>(
    () => ({
      profile,
      update,
      recordAttempt,
      addCustomGesture,
      removeCustomGesture,
      earnBadge,
      trackVocabulary,
      topVocabulary,
      addXp,
      pingActivity,
      markLessonComplete,
      toggleFavorite,
      isFavorite,
      level: levelInfo.level,
      currentLevelXp: levelInfo.currentLevelXp,
      nextLevelXp: levelInfo.nextLevelXp,
    }),
    [profile, update, recordAttempt, addCustomGesture, removeCustomGesture, earnBadge, trackVocabulary, topVocabulary, addXp, pingActivity, markLessonComplete, toggleFavorite, isFavorite, levelInfo],
  );

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used inside UserProfileProvider');
  return ctx;
}
