import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { AccessibleButton } from '@/components/AccessibleButton';
import { SignAvatar } from '@/components/SignAvatar';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { useConversations } from '@/context/ConversationContext';
import { dictionaryEntryById } from '@/data/dictionary';
import { textToCues } from '@/utils/gloss';
import { speak } from '@/services/voice/tts';

export default function DictionaryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme, settings, haptic, describe } = useAccessibility();
  const { isFavorite, toggleFavorite, trackVocabulary } = useUserProfile();
  const { startConversation, addTurn } = useConversations();

  const entry = useMemo(() => (typeof id === 'string' ? dictionaryEntryById(id) : undefined), [id]);

  if (!entry) {
    return (
      <Screen>
        <Text style={{ color: theme.colors.text }}>Entry not found.</Text>
        <AccessibleButton title="Back" onPress={() => router.back()} variant="ghost" />
      </Screen>
    );
  }

  const cues = useMemo(() => textToCues(entry.english, entry.language), [entry]);

  return (
    <>
      <Stack.Screen options={{ title: entry.gloss }} />
      <Screen>
        <Text style={[styles.gloss, { color: theme.colors.text, fontSize: 28 * settings.fontScale }]}>{entry.gloss}</Text>
        <Text style={[styles.english, { color: theme.colors.textMuted, fontSize: 15 * settings.fontScale }]}>
          {entry.english} · {entry.language} · {entry.category} · {entry.difficulty}
        </Text>

        <SignAvatar
          cues={cues}
          speed={settings.signingSpeed}
          skinTone={settings.avatarSkinTone}
          style={settings.avatarStyle}
        />

        <Card title="How to sign it">
          <Meta label="Handshape" value={entry.handshape} />
          <Meta label="Movement" value={entry.movement} />
          <Text style={[styles.desc, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>
            {entry.description}
          </Text>
          {entry.exampleSentence ? (
            <Text style={[styles.example, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>
              Example: “{entry.exampleSentence}”
            </Text>
          ) : null}
        </Card>

        <View style={styles.row}>
          <AccessibleButton
            title={isFavorite(entry.id) ? '★ Favorited' : '☆ Favorite'}
            variant={isFavorite(entry.id) ? 'success' : 'secondary'}
            onPress={() => {
              haptic('selection');
              toggleFavorite(entry.id);
            }}
          />
          <AccessibleButton
            title="Hear it"
            variant="ghost"
            onPress={() => {
              describe(`${entry.english}. ${entry.description}`);
              speak(entry.english);
            }}
          />
        </View>

        <AccessibleButton
          title="Add to conversation"
          variant="primary"
          onPress={() => {
            const conv = startConversation(`Dictionary: ${entry.english}`);
            addTurn(conv.id, {
              speaker: 'me',
              mode: 'sign',
              text: entry.english,
              gloss: entry.gloss,
              language: entry.language,
              confidence: 1,
            });
            trackVocabulary(entry.gloss);
            haptic('success');
            router.push(`/conversation/${conv.id}`);
          }}
        />
      </Screen>
    </>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  const { theme, settings } = useAccessibility();
  return (
    <View style={styles.metaRow}>
      <Text style={[styles.metaLabel, { color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }]}>{label}</Text>
      <Text style={[styles.metaValue, { color: theme.colors.text, fontSize: 14 * settings.fontScale }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gloss: { fontWeight: '800' },
  english: { marginTop: 2, marginBottom: 12 },
  desc: { marginTop: 6 },
  example: { marginTop: 6, fontStyle: 'italic' },
  metaRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  metaLabel: { width: 90, fontWeight: '600' },
  metaValue: { flex: 1, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
});
