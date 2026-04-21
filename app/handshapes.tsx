import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { useAccessibility } from '@/context/AccessibilityContext';
import { HANDSHAPES, type Handshape } from '@/data/handshapes';

export default function HandshapeReference() {
  const { theme, settings } = useAccessibility();
  const [filter, setFilter] = useState<Handshape['category'] | 'all'>('all');

  const entries = useMemo(() => (filter === 'all' ? HANDSHAPES : HANDSHAPES.filter((h) => h.category === filter)), [filter]);

  return (
    <Screen>
      <Text style={[styles.heading, { color: theme.colors.text, fontSize: 24 * settings.fontScale }]}>Handshape reference</Text>
      <Text style={[styles.sub, { color: theme.colors.textMuted, fontSize: 14 * settings.fontScale }]}>
        Canonical handshapes and the signs that use them.
      </Text>

      <View style={styles.row}>
        {(['all', 'alphabet', 'number', 'classifier'] as const).map((c) => (
          <Chip key={c} label={c} selected={filter === c} onPress={() => setFilter(c)} />
        ))}
      </View>

      {entries.map((h) => (
        <Card key={h.id} title={`${h.label} · ${h.category}`}>
          <Text style={{ color: theme.colors.text, fontSize: 15 * settings.fontScale }}>{h.description}</Text>
          {h.tip ? (
            <Text style={{ color: theme.colors.textMuted, fontSize: 13 * settings.fontScale, fontStyle: 'italic' }}>
              Tip: {h.tip}
            </Text>
          ) : null}
          <Text style={{ color: theme.colors.textMuted, fontSize: 13 * settings.fontScale }}>
            Used in: {h.usedIn.join(', ')}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontWeight: '800' },
  sub: { marginTop: 2, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
});
