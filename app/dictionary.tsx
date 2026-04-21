import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Chip } from '@/components/Chip';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { DICTIONARY, DICTIONARY_CATEGORIES, searchDictionary, type DictionaryEntry } from '@/data/dictionary';

const ALL: DictionaryEntry['category'] | 'all' = 'all';

export default function DictionaryScreen() {
  const router = useRouter();
  const { theme, settings, haptic } = useAccessibility();
  const { isFavorite, toggleFavorite } = useUserProfile();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<DictionaryEntry['category'] | 'all'>(ALL);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const entries = useMemo(() => {
    let list = searchDictionary(query);
    if (category !== 'all') list = list.filter((e) => e.category === category);
    if (favoritesOnly) list = list.filter((e) => isFavorite(e.id));
    return list;
  }, [query, category, favoritesOnly, isFavorite]);

  return (
    <Screen padded scroll={false}>
      <Text style={[styles.heading, { color: theme.colors.text, fontSize: 26 * settings.fontScale }]}>Sign dictionary</Text>
      <Text style={[styles.sub, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>
        {DICTIONARY.length} signs · tap any entry to practice it on the avatar
      </Text>

      <TextInput
        accessibilityLabel="Search signs"
        placeholder="Search signs, handshapes, categories…"
        placeholderTextColor={theme.colors.textMuted}
        value={query}
        onChangeText={setQuery}
        style={[
          styles.search,
          {
            backgroundColor: theme.colors.surfaceElevated,
            color: theme.colors.text,
            borderColor: theme.colors.border,
            fontSize: 15 * settings.fontScale,
          },
        ]}
      />

      <View style={styles.rowWrap}>
        <Chip label="All" selected={category === 'all' && !favoritesOnly} onPress={() => { setCategory('all'); setFavoritesOnly(false); }} />
        <Chip label="★ Favorites" selected={favoritesOnly} onPress={() => setFavoritesOnly((v) => !v)} />
        {DICTIONARY_CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={c.charAt(0).toUpperCase() + c.slice(1)}
            selected={category === c && !favoritesOnly}
            onPress={() => { setCategory(c); setFavoritesOnly(false); }}
          />
        ))}
      </View>

      <FlatList
        data={entries}
        keyExtractor={(e) => e.id}
        style={{ flex: 1, marginTop: 12 }}
        contentContainerStyle={{ paddingBottom: 40, gap: 8 }}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.english}. ${item.handshape}. ${item.description}`}
            onPress={() => {
              haptic('selection');
              router.push(`/dictionary/${item.id}`);
            }}
            style={[styles.row, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.titleRow}>
                <Text style={[styles.gloss, { color: theme.colors.text, fontSize: 17 * settings.fontScale }]}>{item.gloss}</Text>
                <Text style={[styles.pill, { color: theme.colors.primaryContrast, backgroundColor: theme.colors.primary }]}>
                  {item.language}
                </Text>
              </View>
              <Text style={[styles.english, { color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }]}>
                {item.english} · {item.category} · {item.handshape}
              </Text>
              <Text numberOfLines={2} style={[styles.desc, { color: theme.colors.text, fontSize: 13 * settings.fontScale }]}>
                {item.description}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'}
              onPress={() => {
                haptic('light');
                toggleFavorite(item.id);
              }}
              style={styles.fav}
            >
              <Text style={{ fontSize: 22, color: isFavorite(item.id) ? theme.colors.warning : theme.colors.textMuted }}>
                {isFavorite(item.id) ? '★' : '☆'}
              </Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ color: theme.colors.textMuted, textAlign: 'center', marginTop: 40 }}>
            No signs match your filters.
          </Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontWeight: '800' },
  sub: { marginTop: 4, marginBottom: 12 },
  search: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gloss: { fontWeight: '800' },
  pill: { fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, overflow: 'hidden' },
  english: { marginTop: 2 },
  desc: { marginTop: 4 },
  fav: { padding: 6 },
});
