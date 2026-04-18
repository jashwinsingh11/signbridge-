import type { Badge, Lesson } from '@/types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-asl-alphabet',
    title: 'ASL Fingerspelling: A–E',
    description: 'Learn the first five letters of the American manual alphabet.',
    difficulty: 'beginner',
    language: 'ASL',
    estimatedMinutes: 5,
    steps: [
      { id: 's1', gloss: 'A', instruction: 'Make a fist with your thumb resting against the side of your index finger.', tip: 'Keep the knuckles forward.', phonetic: 'ay' },
      { id: 's2', gloss: 'B', instruction: 'Hold your hand up, fingers straight, thumb across the palm.', phonetic: 'bee' },
      { id: 's3', gloss: 'C', instruction: 'Curve your hand into the shape of the letter C.', phonetic: 'see' },
      { id: 's4', gloss: 'D', instruction: 'Touch your thumb to your middle, ring, and pinky fingers, index pointing up.', phonetic: 'dee' },
      { id: 's5', gloss: 'E', instruction: 'Curl your fingers in and place your thumb across them.', phonetic: 'ee' },
    ],
  },
  {
    id: 'lesson-asl-greetings',
    title: 'ASL Greetings',
    description: 'Essential greetings for daily conversation.',
    difficulty: 'beginner',
    language: 'ASL',
    estimatedMinutes: 6,
    steps: [
      { id: 's1', gloss: 'HELLO', instruction: 'Salute from your forehead outward.', tip: 'Relaxed flat hand.' },
      { id: 's2', gloss: 'THANK-YOU', instruction: 'Touch your chin with a flat hand and move it forward.' },
      { id: 's3', gloss: 'PLEASE', instruction: 'Flat hand circles on your chest.' },
      { id: 's4', gloss: 'SORRY', instruction: 'Fist circles on your chest.' },
      { id: 's5', gloss: 'YES', instruction: 'Fist nods up and down like a head nod.' },
      { id: 's6', gloss: 'NO', instruction: 'Index and middle finger tap the thumb twice.' },
    ],
  },
  {
    id: 'lesson-bsl-basics',
    title: 'BSL Basics',
    description: 'British Sign Language starter vocabulary.',
    difficulty: 'beginner',
    language: 'BSL',
    estimatedMinutes: 7,
    steps: [
      { id: 's1', gloss: 'HELLO', instruction: 'Wave with an open hand.' },
      { id: 's2', gloss: 'GOOD', instruction: 'Thumbs up from a flat starting position.' },
      { id: 's3', gloss: 'MORNING', instruction: 'Sweep your flat hand up like a rising sun.' },
      { id: 's4', gloss: 'YES', instruction: 'Nod a fist up and down.' },
      { id: 's5', gloss: 'NO', instruction: 'Tap index and middle fingers against thumb.' },
    ],
  },
  {
    id: 'lesson-isl-family',
    title: 'ISL Family Signs',
    description: 'Indian Sign Language vocabulary for family members.',
    difficulty: 'intermediate',
    language: 'ISL',
    estimatedMinutes: 8,
    steps: [
      { id: 's1', gloss: 'MOTHER', instruction: 'Touch thumb to chin with spread fingers.' },
      { id: 's2', gloss: 'FATHER', instruction: 'Touch thumb to forehead with spread fingers.' },
      { id: 's3', gloss: 'BROTHER', instruction: 'Index fingers tap together twice.' },
      { id: 's4', gloss: 'SISTER', instruction: 'Pinky fingers tap together twice.' },
      { id: 's5', gloss: 'FAMILY', instruction: 'Draw a circle with both F-handshapes.' },
    ],
  },
  {
    id: 'lesson-asl-numbers',
    title: 'ASL Numbers 1–10',
    description: 'Learn the numeric handshapes.',
    difficulty: 'beginner',
    language: 'ASL',
    estimatedMinutes: 4,
    steps: [
      { id: 's1', gloss: 'ONE', instruction: 'Hold up your index finger.' },
      { id: 's2', gloss: 'TWO', instruction: 'Hold up index and middle fingers.' },
      { id: 's3', gloss: 'THREE', instruction: 'Hold up thumb, index, and middle fingers.' },
      { id: 's4', gloss: 'FOUR', instruction: 'Hold up four fingers, thumb tucked.' },
      { id: 's5', gloss: 'FIVE', instruction: 'Open palm, all fingers spread.' },
      { id: 's6', gloss: 'TEN', instruction: 'Thumbs up shake.' },
    ],
  },
  {
    id: 'lesson-asl-conversation',
    title: 'ASL Everyday Conversation',
    description: 'Combine signs into short sentences.',
    difficulty: 'advanced',
    language: 'ASL',
    estimatedMinutes: 12,
    steps: [
      { id: 's1', gloss: 'WHAT-YOUR-NAME', instruction: '"What is your name?" — sign WHAT then YOUR then NAME.' },
      { id: 's2', gloss: 'NICE-MEET-YOU', instruction: '"Nice to meet you" — sign NICE then MEET.' },
      { id: 's3', gloss: 'WHERE-LIVE', instruction: '"Where do you live?" — sign WHERE then YOU then LIVE.' },
      { id: 's4', gloss: 'HOW-ARE-YOU', instruction: '"How are you?" — sign HOW then YOU.' },
      { id: 's5', gloss: 'I-LEARN-SIGN', instruction: '"I am learning sign language."' },
    ],
  },
];

export const BADGES: Badge[] = [
  { id: 'badge-first-lesson', title: 'First Steps', description: 'Complete your first lesson.', icon: '🎓' },
  { id: 'badge-five-lessons', title: 'Dedicated Learner', description: 'Complete five lessons.', icon: '📚' },
  { id: 'badge-daily-7', title: 'Week Warrior', description: 'Practice seven days in a row.', icon: '🔥' },
  { id: 'badge-accuracy', title: 'Accuracy Ace', description: 'Score 90%+ on a practice session.', icon: '🎯' },
  { id: 'badge-polyglot', title: 'Polyglot', description: 'Practice in two different sign languages.', icon: '🌐' },
  { id: 'badge-custom', title: 'Personal Touch', description: 'Add a custom gesture to your library.', icon: '✨' },
];

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function dailyChallenge(dateSeed: number = Date.now()): Lesson {
  const day = Math.floor(dateSeed / (1000 * 60 * 60 * 24));
  return LESSONS[day % LESSONS.length];
}
