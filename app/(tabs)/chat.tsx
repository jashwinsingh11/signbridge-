import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { AccessibleButton } from '@/components/AccessibleButton';
import { EmptyState } from '@/components/EmptyState';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useConversations } from '@/context/ConversationContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { QUICK_PHRASES } from '@/data/quickPhrases';
import { EMERGENCY_PHRASES } from '@/data/emergencyPhrases';
import { textToCues } from '@/utils/gloss';
import { speak as tts } from '@/services/voice/tts';
import type { ConversationTurn } from '@/types';

const CATEGORIES = ['greeting', 'need', 'social', 'medical', 'travel', 'custom'] as const;
type Category = (typeof CATEGORIES)[number];

export default function ChatScreen() {
  const router = useRouter();
  const { theme, settings, announce, haptic } = useAccessibility();
  const { profile } = useUserProfile();
  const { conversations, activeId, setActiveId, startConversation, addTurn, activeConversation, suggestions } = useConversations();

  const [draft, setDraft] = useState('');
  const [category, setCategory] = useState<Category>('greeting');

  useEffect(() => {
    if (!activeId && conversations.length > 0) setActiveId(conversations[0].id);
  }, [activeId, conversations, setActiveId]);

  const conversation = activeConversation ?? null;
  const turns: ConversationTurn[] = conversation?.turns ?? [];
  const contextSuggestions = useMemo(() => suggestions(turns), [turns, suggestions]);

  const sendText = (text: string, speaker: 'me' | 'them' = 'me') => {
    if (!text.trim()) return;
    const id = conversation?.id ?? startConversation().id;
    addTurn(id, {
      speaker,
      mode: 'voice',
      text,
      language: profile.preferredSpokenLocale,
    });
    haptic('light');
    announce(`${speaker === 'me' ? 'You said' : 'They said'}: ${text}`);
    setDraft('');
  };

  const signText = (text: string) => {
    const id = conversation?.id ?? startConversation().id;
    addTurn(id, {
      speaker: 'me',
      mode: 'sign',
      text,
      gloss: textToCues(text, profile.preferredSignLanguage).map((c) => c.gloss).join(' '),
      language: profile.preferredSignLanguage,
    });
    haptic('success');
  };

  const speakText = (text: string) => {
    tts(text, { locale: profile.preferredSpokenLocale });
    haptic('selection');
  };

  const phrases = QUICK_PHRASES.filter((p) => p.category === category);

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <Card title="Conversations">
          <View style={styles.row}>
            <AccessibleButton title="New conversation" onPress={() => startConversation()} variant="primary" />
            <AccessibleButton title="History" variant="ghost" onPress={() => router.push('/conversation/list')} />
          </View>
          {conversations.length === 0 ? (
            <EmptyState icon="◊" title="No conversations yet" description="Start a new one to begin." />
          ) : (
            <View style={styles.chipRow}>
              {conversations.slice(0, 6).map((c) => (
                <Chip
                  key={c.id}
                  label={c.title.slice(0, 22)}
                  selected={activeId === c.id}
                  onPress={() => setActiveId(c.id)}
                />
              ))}
            </View>
          )}
        </Card>

        <View style={[styles.chatBody, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <FlatList
            data={turns}
            keyExtractor={(t) => t.id}
            contentContainerStyle={styles.messages}
            ListEmptyComponent={<EmptyState icon="…" title="Start chatting" description="Use quick phrases or type below." />}
            renderItem={({ item }) => <Bubble turn={item} />}
            inverted={false}
          />
        </View>

        <Card title="Context suggestions" subtitle="Tap to send">
          <View style={styles.chipRow}>
            {contextSuggestions.map((s) => (
              <Chip key={s} label={s} onPress={() => sendText(s)} />
            ))}
          </View>
        </Card>

        <Card title="Quick phrases">
          <View style={styles.chipRow}>
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
            ))}
          </View>
          <View style={styles.chipRow}>
            {phrases.length === 0 ? (
              <Text style={{ color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }}>
                No phrases in this category yet.
              </Text>
            ) : (
              phrases.map((p) => <Chip key={p.id} label={p.text} onPress={() => sendText(p.text)} />)
            )}
          </View>
        </Card>

        <Card title="Emergency" subtitle="Sends a high-priority alert with haptic + audio.">
          <View style={styles.chipRow}>
            {EMERGENCY_PHRASES.map((p) => (
              <AccessibleButton
                key={p.id}
                title={p.text}
                size="sm"
                variant={p.severity === 'critical' ? 'danger' : 'secondary'}
                hapticPattern="heavy"
                onPress={() => {
                  haptic('heavy');
                  speakText(p.text);
                  sendText(p.text);
                  announce(`Emergency: ${p.text}`);
                }}
              />
            ))}
          </View>
        </Card>

        <View style={[styles.composer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message…"
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.composerInput, { color: theme.colors.text, borderColor: theme.colors.border, fontSize: 15 * settings.fontScale }]}
            accessibilityLabel="Message composer"
          />
          <View style={styles.row}>
            <AccessibleButton title="Send voice" size="sm" onPress={() => { speakText(draft); sendText(draft); }} style={styles.flex1} />
            <AccessibleButton title="Send as sign" size="sm" variant="success" onPress={() => { signText(draft); setDraft(''); }} style={styles.flex1} />
            <AccessibleButton title="Them said" size="sm" variant="secondary" onPress={() => sendText(draft, 'them')} style={styles.flex1} accessibilityHint="Records what the other person said." />
          </View>
        </View>
      </View>
    </Screen>
  );
}

function Bubble({ turn }: { turn: ConversationTurn }) {
  const { theme, settings } = useAccessibility();
  const mine = turn.speaker === 'me';
  const time = new Date(turn.timestampMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <View
      accessibilityLabel={`${mine ? 'You' : 'They'} said ${turn.text} via ${turn.mode} at ${time}.`}
      style={[
        styles.bubble,
        mine ? styles.bubbleMine : styles.bubbleTheirs,
        {
          backgroundColor: mine ? theme.colors.primary : theme.colors.surfaceElevated,
          borderColor: mine ? theme.colors.primary : theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.bubbleMeta, { color: mine ? theme.colors.primaryContrast : theme.colors.textMuted, fontSize: 11 * settings.fontScale }]}>
        {turn.mode === 'sign' ? 'SIGN' : 'VOICE'} · {time}
      </Text>
      <Text style={[styles.bubbleText, { color: mine ? theme.colors.primaryContrast : theme.colors.text, fontSize: 15 * settings.fontScale }]}>
        {turn.text}
      </Text>
      {turn.gloss ? (
        <Text style={[styles.bubbleGloss, { color: mine ? theme.colors.primaryContrast : theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>
          Gloss: {turn.gloss}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  row: { flexDirection: 'row', gap: 8 },
  flex1: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chatBody: { flex: 1, minHeight: 160, borderRadius: 16, borderWidth: 1, padding: 8 },
  messages: { gap: 8, padding: 4 },
  composer: { borderRadius: 16, borderWidth: 1, padding: 12, gap: 8 },
  composerInput: { borderWidth: 1, borderRadius: 12, padding: 10, minHeight: 44 },
  bubble: { padding: 10, borderRadius: 14, borderWidth: 1, maxWidth: '86%' },
  bubbleMine: { alignSelf: 'flex-end' },
  bubbleTheirs: { alignSelf: 'flex-start' },
  bubbleMeta: { fontWeight: '700', letterSpacing: 0.5 },
  bubbleText: { marginTop: 2 },
  bubbleGloss: { marginTop: 4, fontStyle: 'italic' },
});
