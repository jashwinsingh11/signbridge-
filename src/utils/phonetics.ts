/**
 * Very lightweight phonetic breakdown for complex words. This is intentionally
 * heuristic — it gives the user a reasonable syllable-level guide without
 * pulling in a CMU dictionary or server-side phonemizer.
 */
const VOWELS = 'aeiouyAEIOUY';

export function phoneticBreakdown(word: string): string[] {
  const clean = word.trim();
  if (!clean) return [];
  if (clean.length <= 3) return [clean];

  const syllables: string[] = [];
  let current = '';
  let lastWasVowel = false;
  let vowelSeen = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const isVowel = VOWELS.includes(ch);
    current += ch;

    if (isVowel) {
      vowelSeen = true;
      lastWasVowel = true;
    } else if (lastWasVowel && vowelSeen) {
      const next = clean[i + 1];
      if (next && !VOWELS.includes(next)) {
        syllables.push(current);
        current = '';
        vowelSeen = false;
      }
      lastWasVowel = false;
    } else {
      lastWasVowel = false;
    }
  }
  if (current) syllables.push(current);
  return syllables;
}

export function phoneticJoin(word: string): string {
  return phoneticBreakdown(word).join('·');
}
