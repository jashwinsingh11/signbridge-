import type { AvatarAnimationCue, SignLanguageCode } from '@/types';
import { phoneticJoin } from './phonetics';

const STOPWORDS = new Set(['a', 'an', 'the', 'is', 'are', 'am', 'to', 'of', 'in', 'on', 'at', 'and']);

const HANDSHAPE_FOR_LETTER: Record<string, string> = {
  A: 'closed-fist', B: 'flat-hand', C: 'c-shape', D: 'd-shape', E: 'closed-claw',
  F: 'f-shape', G: 'pinch', H: 'index-middle', I: 'pinky-up', J: 'pinky-draw',
  K: 'k-shape', L: 'l-shape', M: 'm-shape', N: 'n-shape', O: 'o-shape',
  P: 'p-shape', Q: 'q-shape', R: 'r-shape', S: 'fist', T: 't-shape',
  U: 'u-shape', V: 'v-shape', W: 'w-shape', X: 'hook', Y: 'y-shape', Z: 'z-draw',
};

/**
 * Convert arbitrary input text into gloss-level cues suitable for the avatar.
 * Multi-word vocab is preserved as single cues; unknown words are fingerspelled.
 */
export function textToCues(text: string, _language: SignLanguageCode = 'ASL'): AvatarAnimationCue[] {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !STOPWORDS.has(w));
  if (words.length === 0) return [];

  const cues: AvatarAnimationCue[] = [];
  for (const w of words) {
    if (KNOWN_VOCAB.has(w)) {
      cues.push({ gloss: w.toUpperCase(), durationMs: 900, handshape: KNOWN_VOCAB.get(w) ?? 'neutral' });
      continue;
    }
    // Fingerspell unknown words letter by letter.
    const phon = phoneticJoin(w);
    cues.push({ gloss: `fs:${w.toUpperCase()}`, durationMs: 200, handshape: 'fingerspell-start', phonetic: phon });
    for (const ch of w.toUpperCase()) {
      const shape = HANDSHAPE_FOR_LETTER[ch] ?? 'neutral';
      cues.push({ gloss: ch, durationMs: 380, handshape: shape });
    }
  }
  return cues;
}

const KNOWN_VOCAB = new Map<string, string>([
  ['hello', 'salute'],
  ['hi', 'wave'],
  ['please', 'chest-circle'],
  ['thanks', 'chin-out'],
  ['thank', 'chin-out'],
  ['you', 'point'],
  ['i', 'self-point'],
  ['me', 'self-point'],
  ['name', 'index-middle-stack'],
  ['yes', 'fist-nod'],
  ['no', 'two-finger-tap'],
  ['help', 'thumb-on-palm'],
  ['love', 'crossed-arms'],
  ['learn', 'grab-to-head'],
  ['sign', 'index-circles'],
  ['water', 'w-to-chin'],
  ['food', 'flat-o-to-mouth'],
  ['eat', 'flat-o-to-mouth'],
  ['family', 'f-shape-circle'],
  ['friend', 'hook-hook'],
  ['sorry', 'fist-circle-chest'],
  ['good', 'thumbs-up'],
  ['morning', 'arm-rise'],
]);
