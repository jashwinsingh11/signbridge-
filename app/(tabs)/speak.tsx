import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { AccessibleButton } from '@/components/AccessibleButton';
import { Chip } from '@/components/Chip';
import { SignAvatar } from '@/components/SignAvatar';
import { EmptyState } from '@/components/EmptyState';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useUserProfile } from '@/context/UserProfileContext';
import { useConversations } from '@/context/ConversationContext';
import { SPOKEN_LANGUAGES, SIGN_LANGUAGES, signLanguageByCode } from '@/data/signLanguages';
import { speak as tts, stopSpeaking } from '@/services/voice/tts';
import { startListening, stopListening } from '@/services/voice/stt';
import { textToCues } from '@/utils/gloss';
import { phoneticJoin } from '@/utils/phonetics';
import type { AvatarAnimationCue, SignLanguageCode, SpokenLocale } from '@/types';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

export default function SpeakScreen() {
  const { theme, settings, announce, haptic, setSetting } = useAccessibility();
  const { profile, update, trackVocabulary } = useUserProfile();
  const { activeId, startConversation, addTurn } = useConversations();

  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [cues, setCues] = useState<AvatarAnimationCue[]>([]);
  const [language, setLanguage] = useState<SignLanguageCode>(profile.preferredSignLanguage);
  const [locale, setLocale] = useState<SpokenLocale>(profile.preferredSpokenLocale);

  const phonetic = useMemo(() => {
    const longWord = text.split(/\s+/).find((w) => w.length > 6);
    return longWord ? phoneticJoin(longWord) : '';
  }, [text]);

  const renderFromText = useCallback(
    (source: string) => {
      const next = textToCues(source, language);
      setCues(next);
      next.forEach((c) => trackVocabulary(c.gloss));
      haptic(next.length > 0 ? 'success' : 'warning');
      announce(next.length > 0 ? `Signing ${next.length} gestures.` : 'Nothing to sign.', { speak: false });
    },
    [language, trackVocabulary, haptic, announce],
  );

  const onToggleListen = async () => {
    if (!listening) {
      try {
        await startListening();
        setListening(true);
        haptic('light');
        announce('Listening. Speak now.');
      } catch {
        haptic('error');
        announce('Microphone permission required.');
      }
    } else {
      setListening(false);
      const result = await stopListening(locale);
      haptic('light');
      if (!result) return;
      if (result.text) {
        setText(result.text);
        renderFromText(result.text);
      } else {
        announce('Voice transcription is not configured. Type text instead.', { speak: true });
      }
    }
  };

  const onSign = () => {
    if (!text.trim()) return;
    renderFromText(text);
  };

  const onSpeakBack = () => {
    if (!text.trim()) return;
    stopSpeaking();
    tts(text, { locale, rate: settings.signingSpeed });
  };

  const onSaveTurn = () => {
    if (!text.trim()) return;
    const id = activeId ?? startConversation('Voice-to-sign').id;
    addTurn(id, {
      speaker: 'me',
      mode: 'voice',
      text,
      gloss: cues.map((c) => c.gloss).join(' '),
      language: locale,
    });
    announce('Saved to conversation history.', { speak: true });
  };

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const langName = signLanguageByCode(language)?.name ?? language;

  return (
    <Screen>
      <Card title="Avatar" subtitle={`Signing in ${langName} at ${settings.signingSpeed.toFixed(2)}x speed`}>
        {cues.length > 0 ? (
          <SignAvatar
            cues={cues}
            speed={settings.signingSpeed}
            skinTone={settings.avatarSkinTone}
            style={settings.avatarStyle}
          />
        ) : (
          <EmptyState icon="◈" title="No animation yet" description="Type or speak something below to animate the avatar." />
        )}
      </Card>

      <Card title="Say something">
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={3}
          placeholder="Type what you want to sign, or press Listen."
          placeholderTextColor={theme.colors.textMuted}
          accessibilityLabel="Input text to translate into sign language"
          style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, fontSize: 16 * settings.fontScale }]}
        />
        {phonetic ? (
          <Text style={[styles.phonetic, { color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }]}>
            Phonetic hint: {phonetic}
          </Text>
        ) : null}
        <View style={styles.row}>
          <AccessibleButton
            title={listening ? 'Stop listening' : 'Listen'}
            variant={listening ? 'danger' : 'primary'}
            onPress={onToggleListen}
            style={styles.flex1}
            accessibilityHint="Records your voice and transcribes it."
          />
          <AccessibleButton title="Sign it" variant="success" onPress={onSign} style={styles.flex1} />
        </View>
        <View style={styles.row}>
          <AccessibleButton title="Speak it back" variant="secondary" onPress={onSpeakBack} style={styles.flex1} />
          <AccessibleButton title="Save turn" variant="ghost" onPress={onSaveTurn} style={styles.flex1} />
        </View>
      </Card>

      <Card title="Input language">
        <View style={styles.chipRow}>
          {SPOKEN_LANGUAGES.map((l) => (
            <Chip
              key={l.locale}
              label={l.nativeName}
              selected={locale === l.locale}
              onPress={() => {
                setLocale(l.locale);
                update({ preferredSpokenLocale: l.locale });
              }}
            />
          ))}
        </View>
      </Card>

      <Card title="Sign language">
        <View style={styles.chipRow}>
          {SIGN_LANGUAGES.map((l) => (
            <Chip
              key={l.code}
              label={l.code}
              selected={language === l.code}
              onPress={() => {
                setLanguage(l.code);
                update({ preferredSignLanguage: l.code });
              }}
            />
          ))}
        </View>
      </Card>

      <Card title="Avatar settings">
        <Text style={[styles.rowLabel, { color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }]}>Speed</Text>
        <View style={styles.chipRow}>
          {SPEEDS.map((s) => (
            <Chip
              key={s}
              label={`${s}x`}
              selected={Math.abs(settings.signingSpeed - s) < 0.01}
              onPress={() => setSetting('signingSpeed', s)}
            />
          ))}
        </View>
        <Text style={[styles.rowLabel, { color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }]}>Style</Text>
        <View style={styles.chipRow}>
          {(['classic', 'modern', 'minimal'] as const).map((s) => (
            <Chip
              key={s}
              label={s}
              selected={settings.avatarStyle === s}
              onPress={() => setSetting('avatarStyle', s)}
            />
          ))}
        </View>
        <Text style={[styles.rowLabel, { color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }]}>Skin tone</Text>
        <View style={styles.chipRow}>
          {(['light', 'medium', 'dark'] as const).map((s) => (
            <Chip
              key={s}
              label={s}
              selected={settings.avatarSkinTone === s}
              onPress={() => setSetting('avatarSkinTone', s)}
            />
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 72, textAlignVertical: 'top' },
  phonetic: { fontStyle: 'italic' },
  row: { flexDirection: 'row', gap: 10 },
  flex1: { flex: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rowLabel: { fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
});
