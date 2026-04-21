import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Conversation, ConversationTurn } from '@/types';
import { loadJSON, saveJSON, StorageKeys } from '@/services/storage';

interface ConversationContextValue {
  conversations: Conversation[];
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  startConversation: (title?: string) => Conversation;
  addTurn: (conversationId: string, turn: Omit<ConversationTurn, 'id' | 'timestampMs'>) => ConversationTurn;
  renameConversation: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  clearAll: () => void;
  activeConversation: Conversation | null;
  suggestions: (turns: ConversationTurn[]) => string[];
}

const ConversationContext = createContext<ConversationContextValue | null>(null);

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function contextSuggestions(turns: ConversationTurn[]): string[] {
  if (turns.length === 0) {
    return ['Hello, nice to meet you.', 'My name is…', 'Can you help me, please?'];
  }
  const lastText = turns[turns.length - 1]?.text?.toLowerCase() ?? '';
  if (/hello|hi|hey/.test(lastText)) return ['Hello!', 'Nice to meet you.', 'How are you today?'];
  if (/name/.test(lastText)) return ['My name is…', 'Nice to meet you.', 'Where are you from?'];
  if (/how.*you|how are/.test(lastText)) return ['I am well, thank you.', 'A little tired.', 'Thanks for asking.'];
  if (/help/.test(lastText)) return ['Yes, I can help.', 'What do you need?', 'Please wait a moment.'];
  if (/pain|hurt|sick|medical/.test(lastText)) return ['Please call a doctor.', 'Where does it hurt?', 'I will get help now.'];
  if (/thank/.test(lastText)) return ['You are welcome.', 'Anytime.', 'Happy to help.'];
  return ['Could you repeat that?', 'Please sign a little slower.', 'Thank you.'];
}

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadJSON<Conversation[]>(StorageKeys.conversations, []).then((list) => {
      setConversations(list);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveJSON(StorageKeys.conversations, conversations);
  }, [conversations, loaded]);

  const setActiveId = useCallback((id: string | null) => setActiveIdState(id), []);

  const startConversation = useCallback((title?: string): Conversation => {
    const convo: Conversation = {
      id: uid('c'),
      title: title ?? new Date().toLocaleString(),
      createdAt: Date.now(),
      turns: [],
    };
    setConversations((c) => [convo, ...c]);
    setActiveIdState(convo.id);
    return convo;
  }, []);

  const addTurn = useCallback(
    (conversationId: string, turn: Omit<ConversationTurn, 'id' | 'timestampMs'>): ConversationTurn => {
      const newTurn: ConversationTurn = {
        ...turn,
        id: uid('t'),
        timestampMs: Date.now(),
      };
      setConversations((list) =>
        list.map((c) => (c.id === conversationId ? { ...c, turns: [...c.turns, newTurn] } : c)),
      );
      return newTurn;
    },
    [],
  );

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((list) => list.map((c) => (c.id === id ? { ...c, title } : c)));
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((list) => list.filter((c) => c.id !== id));
    setActiveIdState((current) => (current === id ? null : current));
  }, []);

  const clearAll = useCallback(() => {
    setConversations([]);
    setActiveIdState(null);
  }, []);

  const activeConversation = useMemo<Conversation | null>(() => {
    if (!activeId) return null;
    return conversations.find((c) => c.id === activeId) ?? null;
  }, [conversations, activeId]);

  const value = useMemo<ConversationContextValue>(
    () => ({
      conversations,
      activeId,
      setActiveId,
      startConversation,
      addTurn,
      renameConversation,
      deleteConversation,
      clearAll,
      activeConversation,
      suggestions: contextSuggestions,
    }),
    [conversations, activeId, setActiveId, startConversation, addTurn, renameConversation, deleteConversation, clearAll, activeConversation],
  );

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>;
}

export function useConversations(): ConversationContextValue {
  const ctx = useContext(ConversationContext);
  if (!ctx) throw new Error('useConversations must be used inside ConversationProvider');
  return ctx;
}
