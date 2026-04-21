import React from 'react';
import { FlatList, Platform, Share, StyleSheet, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { AccessibleButton } from '@/components/AccessibleButton';
import { EmptyState } from '@/components/EmptyState';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useConversations } from '@/context/ConversationContext';
import type { Conversation } from '@/types';

function transcriptFor(convo: Conversation): string {
  const header = `SignBridge transcript — ${convo.title}\n${new Date(convo.createdAt).toLocaleString()}\n`;
  const body = convo.turns
    .map((t) => {
      const who = t.speaker === 'me' ? 'You' : 'Them';
      const time = new Date(t.timestampMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const conf = t.confidence != null ? ` (confidence ${Math.round(t.confidence * 100)}%)` : '';
      return `[${time}] ${who} · ${t.mode.toUpperCase()}${conf}: ${t.text}`;
    })
    .join('\n');
  return `${header}\n${body}`;
}

export default function ConversationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme, settings, announce, haptic } = useAccessibility();
  const { conversations, deleteConversation, setActiveId } = useConversations();

  if (id === 'list') {
    return <ListView />;
  }

  const doShare = async (convo: Conversation) => {
    const text = transcriptFor(convo);
    try {
      if (Platform.OS === 'web') {
        await Clipboard.setStringAsync(text);
        haptic('success');
        announce('Transcript copied to clipboard.');
      } else {
        await Share.share({ message: text, title: `SignBridge: ${convo.title}` });
        haptic('success');
      }
    } catch {
      haptic('error');
      announce('Could not share transcript.');
    }
  };

  const doCopy = async (convo: Conversation) => {
    await Clipboard.setStringAsync(transcriptFor(convo));
    haptic('success');
    announce('Transcript copied to clipboard.');
  };

  const convo = conversations.find((c) => c.id === id);
  if (!convo) {
    return (
      <Screen>
        <Card title="Conversation not found">
          <AccessibleButton title="Back to chat" onPress={() => router.replace('/chat')} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <View style={styles.body}>
        <Card title={convo.title} subtitle={new Date(convo.createdAt).toLocaleString()} />
        <View style={{ flex: 1 }}>
          <FlatList
            data={convo.turns}
            keyExtractor={(t) => t.id}
            contentContainerStyle={styles.messages}
            ListEmptyComponent={<EmptyState icon="◊" title="No turns yet" />}
            renderItem={({ item }) => {
              const mine = item.speaker === 'me';
              const time = new Date(item.timestampMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <View
                  style={[
                    styles.bubble,
                    mine ? styles.bubbleMine : styles.bubbleTheirs,
                    { backgroundColor: mine ? theme.colors.primary : theme.colors.surfaceElevated, borderColor: theme.colors.border },
                  ]}
                >
                  <Text style={[styles.meta, { color: mine ? theme.colors.primaryContrast : theme.colors.textMuted, fontSize: 11 * settings.fontScale }]}>
                    {item.mode.toUpperCase()} · {time}
                  </Text>
                  <Text style={[styles.text, { color: mine ? theme.colors.primaryContrast : theme.colors.text, fontSize: 15 * settings.fontScale }]}>
                    {item.text}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <View style={styles.row}>
          <AccessibleButton
            title="Share"
            variant="primary"
            onPress={() => doShare(convo)}
            style={styles.flex1}
          />
          <AccessibleButton
            title="Copy"
            variant="secondary"
            onPress={() => doCopy(convo)}
            style={styles.flex1}
          />
        </View>
        <View style={styles.row}>
          <AccessibleButton
            title="Resume"
            variant="primary"
            onPress={() => {
              setActiveId(convo.id);
              router.replace('/chat');
            }}
            style={styles.flex1}
          />
          <AccessibleButton
            title="Delete"
            variant="danger"
            onPress={() => {
              deleteConversation(convo.id);
              router.replace('/chat');
            }}
            style={styles.flex1}
          />
        </View>
      </View>
    </Screen>
  );
}

function ListView() {
  const router = useRouter();
  const { theme, settings } = useAccessibility();
  const { conversations, deleteConversation, clearAll, setActiveId } = useConversations();
  return (
    <Screen>
      <Card title="Conversation history" subtitle={`${conversations.length} saved`}>
        {conversations.length === 0 ? (
          <EmptyState icon="◊" title="No conversations" description="Start one from the Talk tab." />
        ) : (
          conversations.map((c) => (
            <View key={c.id} style={[styles.listRow, { borderColor: theme.colors.border }]}>
              <View style={styles.flex1}>
                <Text style={[styles.listTitle, { color: theme.colors.text, fontSize: 15 * settings.fontScale }]}>{c.title}</Text>
                <Text style={[styles.listMeta, { color: theme.colors.textMuted, fontSize: 12 * settings.fontScale }]}>
                  {c.turns.length} turns · {new Date(c.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <AccessibleButton
                title="Open"
                size="sm"
                onPress={() => {
                  setActiveId(c.id);
                  router.push(`/conversation/${c.id}`);
                }}
              />
              <AccessibleButton title="Del" size="sm" variant="ghost" onPress={() => deleteConversation(c.id)} />
            </View>
          ))
        )}
        {conversations.length > 0 ? (
          <AccessibleButton title="Clear all" variant="danger" onPress={clearAll} />
        ) : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, padding: 16, gap: 12 },
  messages: { gap: 8, padding: 4 },
  bubble: { padding: 10, borderRadius: 14, borderWidth: 1, maxWidth: '86%' },
  bubbleMine: { alignSelf: 'flex-end' },
  bubbleTheirs: { alignSelf: 'flex-start' },
  meta: { fontWeight: '700' },
  text: { marginTop: 2 },
  row: { flexDirection: 'row', gap: 10 },
  flex1: { flex: 1 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, paddingVertical: 10 },
  listTitle: { fontWeight: '700' },
  listMeta: {},
});
