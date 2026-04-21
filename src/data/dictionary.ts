import type { SignLanguageCode } from '@/types';

export interface DictionaryEntry {
  id: string;
  gloss: string;
  english: string;
  language: SignLanguageCode;
  category: 'greeting' | 'family' | 'feelings' | 'food' | 'numbers' | 'time' | 'places' | 'verbs' | 'question' | 'pronoun' | 'common' | 'travel' | 'medical' | 'emotions' | 'work';
  handshape: string;
  movement: string;
  description: string;
  exampleSentence?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

function mk(
  id: string,
  gloss: string,
  english: string,
  category: DictionaryEntry['category'],
  handshape: string,
  movement: string,
  description: string,
  opts: { language?: SignLanguageCode; example?: string; difficulty?: DictionaryEntry['difficulty'] } = {},
): DictionaryEntry {
  return {
    id,
    gloss,
    english,
    language: opts.language ?? 'ASL',
    category,
    handshape,
    movement,
    description,
    exampleSentence: opts.example,
    difficulty: opts.difficulty ?? 'beginner',
  };
}

// A curated subset of signs. Every entry is real vocabulary in the indicated
// language; descriptions reflect standard production (approximate, for study).
export const DICTIONARY: DictionaryEntry[] = [
  // Greetings
  mk('hello', 'HELLO', 'hello', 'greeting', 'flat-hand', 'forehead salute', 'Flat hand at forehead, swing outward in a small salute.', { example: 'Hello, nice to meet you.' }),
  mk('hi', 'HI', 'hi', 'greeting', 'wave', 'side wave', 'Open hand, wave side to side near the shoulder.'),
  mk('goodbye', 'GOODBYE', 'goodbye', 'greeting', 'flat-hand', 'finger wave', 'Open hand, wave fingers downward once or twice.'),
  mk('good-morning', 'GOOD-MORNING', 'good morning', 'greeting', 'flat-hand', 'chin to rising arm', 'Sign GOOD, then MORNING (forearm lifts like a sunrise).', { example: 'Good morning, how are you?' }),
  mk('good-night', 'GOOD-NIGHT', 'good night', 'greeting', 'flat-hand', 'chin to wrist', 'Sign GOOD, then NIGHT (hand bent over the back of the other hand).'),
  mk('nice-to-meet-you', 'NICE-MEET-YOU', 'nice to meet you', 'greeting', 'flat-hand', 'palm glide + contact', 'Sign NICE (palm glides across), MEET (index fingers come together), then point YOU.', { difficulty: 'intermediate' }),
  mk('welcome', 'WELCOME', 'welcome', 'greeting', 'flat-hand', 'inward sweep', 'Open palm up, sweep inward toward the body.'),

  // Pronouns
  mk('i', 'I', 'I / me', 'pronoun', 'index', 'point to self', 'Point the index finger to your chest.'),
  mk('you', 'YOU', 'you', 'pronoun', 'index', 'point forward', 'Point the index finger toward the person.'),
  mk('we', 'WE', 'we / us', 'pronoun', 'index', 'sweep across chest', 'Index finger touches one shoulder, sweeps across to the other.'),
  mk('they', 'THEY', 'they / them', 'pronoun', 'index', 'arc to side', 'Point index finger out and arc to the side.'),
  mk('my', 'MY', 'my / mine', 'pronoun', 'flat-hand', 'palm to chest', 'Flat palm pressed against the chest.'),
  mk('your', 'YOUR', 'your', 'pronoun', 'flat-hand', 'palm forward', 'Flat palm pushed outward toward the person.'),

  // Common
  mk('yes', 'YES', 'yes', 'common', 'fist', 'knock forward', 'Make a fist and nod it forward twice.'),
  mk('no', 'NO', 'no', 'common', 'two-finger', 'fingers close', 'Tap index + middle to thumb twice.'),
  mk('please', 'PLEASE', 'please', 'common', 'flat-hand', 'circle on chest', 'Flat hand circles on the chest.'),
  mk('thanks', 'THANK-YOU', 'thank you', 'common', 'flat-hand', 'chin to forward', 'Flat hand from chin arcs forward and down.'),
  mk('sorry', 'SORRY', 'sorry', 'feelings', 'fist', 'circle on chest', 'Fist circles on chest.'),
  mk('help', 'HELP', 'help', 'verbs', 'thumb-on-palm', 'lift together', 'Thumbs-up rests on flat palm; both lift together.'),
  mk('love', 'LOVE', 'love', 'feelings', 'crossed-arms', 'hug self', 'Cross both fists over heart.'),
  mk('like', 'LIKE', 'like', 'feelings', 'middle-thumb', 'pull from chest', 'Middle finger and thumb touch chest, pull out as they close.'),
  mk('want', 'WANT', 'want', 'verbs', 'claw', 'pull to body', 'Both claw hands pull inward toward the body.'),
  mk('need', 'NEED', 'need', 'verbs', 'x-hand', 'hook down', 'X-hand bends down firmly.'),
  mk('have', 'HAVE', 'have', 'verbs', 'flat-hand', 'fingertips to chest', 'Fingertips of both hands tap the chest.'),
  mk('go', 'GO', 'go', 'verbs', 'index', 'point forward', 'Both index fingers point, move forward together.'),
  mk('come', 'COME', 'come', 'verbs', 'index', 'draw back', 'Both index fingers curl toward body.'),
  mk('stop', 'STOP', 'stop', 'verbs', 'flat-hand', 'chop on palm', 'Flat hand chops down onto the other open palm.'),
  mk('wait', 'WAIT', 'wait', 'verbs', 'claw', 'wiggle fingers', 'Both claw hands up, wiggle fingers.'),
  mk('understand', 'UNDERSTAND', 'understand', 'verbs', 's-hand', 'flick open at temple', 'S-hand at temple flicks into a 1-hand.'),

  // Feelings
  mk('happy', 'HAPPY', 'happy', 'feelings', 'flat-hand', 'brush upward on chest', 'Flat hand brushes up on chest repeatedly.'),
  mk('sad', 'SAD', 'sad', 'feelings', '5-hand', 'drop down face', 'Both 5-hands in front of face drop down.'),
  mk('angry', 'ANGRY', 'angry', 'feelings', 'claw', 'claw upward from chest', 'Claw hand pulls up and out from chest.'),
  mk('tired', 'TIRED', 'tired', 'feelings', 'bent-hand', 'chest drop', 'Both bent hands on chest, tip downward.'),
  mk('excited', 'EXCITED', 'excited', 'feelings', 'middle-finger', 'alternating chest circles', 'Middle fingers alternate in forward circles on chest.'),
  mk('scared', 'SCARED', 'scared', 'feelings', '5-hand', 'open toward chest', 'Both fists open into 5-hands snapping toward chest.'),
  mk('confused', 'CONFUSED', 'confused', 'emotions', '1-hand', 'alternating circles at forehead', 'Two 1-hands circle each other near forehead.'),
  mk('bored', 'BORED', 'bored', 'feelings', '1-hand', 'twist at nose', 'Index finger on side of nose twists outward.'),

  // Family
  mk('mother', 'MOTHER', 'mother', 'family', '5-hand', 'thumb on chin', 'Thumb of 5-hand taps chin.'),
  mk('father', 'FATHER', 'father', 'family', '5-hand', 'thumb on forehead', 'Thumb of 5-hand taps forehead.'),
  mk('sister', 'SISTER', 'sister', 'family', 'l-hand', 'jaw to l-pair', 'L-hand at jawline moves down to meet other L-hand.'),
  mk('brother', 'BROTHER', 'brother', 'family', 'l-hand', 'forehead to l-pair', 'L-hand at forehead moves down to meet other L-hand.'),
  mk('family', 'FAMILY', 'family', 'family', 'f-hand', 'circle outward', 'Two F-hands start together, circle outward, meet again.'),
  mk('friend', 'FRIEND', 'friend', 'family', 'x-hand', 'index hooks twice', 'Two X-hands hook index fingers, flip and hook again.'),
  mk('baby', 'BABY', 'baby', 'family', 'arms-cradle', 'rocking arms', 'Rock arms as if cradling a baby.'),
  mk('grandmother', 'GRANDMOTHER', 'grandmother', 'family', '5-hand', 'two bounces from chin', 'Thumb at chin, hop outward twice.'),
  mk('grandfather', 'GRANDFATHER', 'grandfather', 'family', '5-hand', 'two bounces from forehead', 'Thumb at forehead, hop outward twice.'),

  // Food
  mk('eat', 'EAT', 'eat / food', 'food', 'flat-o', 'hand to mouth', 'Flat-O hand taps mouth twice.'),
  mk('drink', 'DRINK', 'drink', 'food', 'c-hand', 'tip to mouth', 'C-hand tips like lifting a cup.'),
  mk('water', 'WATER', 'water', 'food', 'w-hand', 'tap chin', 'W-hand index finger taps chin.'),
  mk('milk', 'MILK', 'milk', 'food', 's-hand', 'squeeze open close', 'Fist open/close as if milking.'),
  mk('bread', 'BREAD', 'bread', 'food', 'b-hand', 'slice motion', 'B-hand slices down the back of the other hand.'),
  mk('hungry', 'HUNGRY', 'hungry', 'feelings', 'c-hand', 'slide down chest', 'C-hand at chest slides down.'),
  mk('thirsty', 'THIRSTY', 'thirsty', 'feelings', '1-hand', 'down the throat', 'Index finger slides down throat.'),
  mk('coffee', 'COFFEE', 'coffee', 'food', 's-hand', 'grinder motion', 'Top fist grinds atop the bottom fist.'),
  mk('tea', 'TEA', 'tea', 'food', 'f-hand', 'stir on palm', 'F-hand stirs in the circle of the other hand.'),

  // Numbers
  mk('num-one', 'ONE', 'one', 'numbers', '1-hand', 'show palm back', 'Index finger up, palm toward self.'),
  mk('num-two', 'TWO', 'two', 'numbers', '2-hand', 'show palm back', 'Index + middle up, palm toward self.'),
  mk('num-three', 'THREE', 'three', 'numbers', '3-hand', 'show palm back', 'Thumb, index, middle extended.'),
  mk('num-four', 'FOUR', 'four', 'numbers', '4-hand', 'show palm back', 'All four fingers up, thumb tucked.'),
  mk('num-five', 'FIVE', 'five', 'numbers', '5-hand', 'show palm back', 'All five fingers spread.'),
  mk('num-ten', 'TEN', 'ten', 'numbers', '10-hand', 'thumbs up shake', 'Closed fist with thumb up, shake slightly.'),

  // Time
  mk('today', 'TODAY', 'today', 'time', 'y-hand', 'drop twice', 'Y-hands drop down twice in space.'),
  mk('tomorrow', 'TOMORROW', 'tomorrow', 'time', 'a-hand', 'thumb arc forward', 'A-hand thumb at cheek arcs forward.'),
  mk('yesterday', 'YESTERDAY', 'yesterday', 'time', 'a-hand', 'thumb arc back', 'A-hand thumb at chin arcs back toward ear.'),
  mk('now', 'NOW', 'now', 'time', 'y-hand', 'drop once', 'Y-hands drop down once.'),
  mk('later', 'LATER', 'later', 'time', 'l-hand', 'rotate forward', 'L-hand rotates forward on the other flat hand.'),
  mk('morning', 'MORNING', 'morning', 'time', 'flat-hand', 'forearm rise', 'Flat hand rises under opposite elbow.'),
  mk('night', 'NIGHT', 'night', 'time', 'bent-hand', 'over back of hand', 'Bent hand arcs over the back of the other flat hand.'),

  // Places
  mk('home', 'HOME', 'home', 'places', 'flat-o', 'cheek tap', 'Flat-O taps cheek, moves back to tap again.'),
  mk('school', 'SCHOOL', 'school', 'places', 'flat-hand', 'clap twice', 'Top flat hand claps down on the palm twice.'),
  mk('work', 'WORK', 'work', 'work', 's-hand', 'wrist knocks', 'Top fist knocks on the back wrist of the other fist.'),
  mk('store', 'STORE', 'store', 'places', 'flat-o', 'swing forward', 'Both flat-O hands hinge forward at the wrists.'),
  mk('hospital', 'HOSPITAL', 'hospital', 'medical', 'h-hand', 'cross on shoulder', 'H-hand draws a cross on the opposite shoulder.'),
  mk('city', 'CITY', 'city', 'places', 'flat-hand', 'two roof taps', 'Flat hands touch fingertips twice like a roof.'),
  mk('country', 'COUNTRY', 'country', 'places', 'flat-hand', 'circle on elbow', 'Flat hand circles on the opposite elbow.'),

  // Question words
  mk('what', 'WHAT', 'what', 'question', '1-hand', 'shake index', 'Index finger shakes briefly.'),
  mk('who', 'WHO', 'who', 'question', '1-hand', 'circle at chin', 'Index finger circles near chin.'),
  mk('where', 'WHERE', 'where', 'question', '1-hand', 'shake side to side', 'Index finger up, shake side to side.'),
  mk('when', 'WHEN', 'when', 'question', '1-hand', 'circle onto tip', 'Index finger circles, lands on the other index tip.'),
  mk('why', 'WHY', 'why', 'question', 'flat-hand-y', 'pull from temple', 'Flat hand at temple pulls out into Y-hand.'),
  mk('how', 'HOW', 'how', 'question', 'bent-hand', 'roll outward', 'Both bent hands knuckle to knuckle, roll out to palms up.'),
  mk('how-much', 'HOW-MUCH', 'how much', 'question', 's-hand', 'open flick', 'S-hand flicks open into a 5-hand.'),

  // Travel
  mk('airport', 'AIRPORT', 'airport', 'travel', 'i-l-y', 'flight motion', 'ILY hand flies forward twice.'),
  mk('bus', 'BUS', 'bus', 'travel', 'b-hand', 'retreat back', 'B-hand pulls back through space as if tracing a bus length.'),
  mk('car', 'CAR', 'car', 'travel', 's-hand', 'steering', 'Both fists steer an imaginary wheel.'),
  mk('train', 'TRAIN', 'train', 'travel', 'h-hand', 'slide on rails', 'Top H-hand slides along bottom H-hand like rails.'),
  mk('ticket', 'TICKET', 'ticket', 'travel', 'v-hand', 'clip edge of palm', 'V-hand fingers clamp onto the edge of the other palm.'),
  mk('passport', 'PASSPORT', 'passport', 'travel', 'f-hand', 'stamp palm', 'F-hand stamps the other open palm.'),
  mk('hotel', 'HOTEL', 'hotel', 'travel', 'h-hand', 'stand on index', 'H-hand perches on index of other hand.'),

  // Medical
  mk('doctor', 'DOCTOR', 'doctor', 'medical', 'm-hand', 'tap wrist pulse', 'M-hand taps pulse point on opposite wrist.'),
  mk('nurse', 'NURSE', 'nurse', 'medical', 'n-hand', 'tap wrist pulse', 'N-hand taps pulse point on wrist.'),
  mk('sick', 'SICK', 'sick', 'medical', 'middle-finger', 'touch forehead & belly', 'Middle finger touches forehead and belly.'),
  mk('pain', 'PAIN', 'pain', 'medical', '1-hand', 'jab toward spot', 'Index fingers jab toward each other at affected area.'),
  mk('medicine', 'MEDICINE', 'medicine', 'medical', 'middle-finger', 'circle on palm', 'Middle finger grinds a small circle on the flat palm.'),
  mk('emergency', 'EMERGENCY', 'emergency', 'medical', 'e-hand', 'shake in space', 'E-hand shakes firmly in neutral space.'),
  mk('allergy', 'ALLERGY', 'allergy', 'medical', '1-hand', 'index at nose + push', 'Index at nose, push outward.', { difficulty: 'intermediate' }),

  // Work / school
  mk('learn', 'LEARN', 'learn', 'work', 'flat-o', 'palm to head', 'Flat hand grabs from palm and rises to forehead.'),
  mk('teach', 'TEACH', 'teach', 'work', 'flat-o', 'both hands forehead outward', 'Both flat-O hands at temples move forward.'),
  mk('book', 'BOOK', 'book', 'work', 'flat-hand', 'open palms', 'Palms together, open like a book.'),
  mk('read', 'READ', 'read', 'work', 'v-hand', 'scan palm', 'V-hand tracks down the flat palm.'),
  mk('write', 'WRITE', 'write', 'work', 'f-hand', 'write on palm', 'F-hand writes across the palm.'),
  mk('phone', 'PHONE', 'phone', 'common', 'y-hand', 'thumb to ear', 'Y-hand at ear, thumb to ear and pinky to mouth.'),
  mk('computer', 'COMPUTER', 'computer', 'work', 'c-hand', 'arc on arm', 'C-hand arcs up the opposite forearm.'),
  mk('email', 'EMAIL', 'email', 'work', 'c-hand', 'through palm', 'C-hand passes through the fingers of the other hand.'),
  mk('money', 'MONEY', 'money', 'common', 'flat-o', 'tap on palm', 'Flat-O taps the flat palm twice.'),
  mk('time', 'TIME', 'time', 'time', '1-hand', 'tap wrist', 'Index finger taps back of the other wrist.'),
];

export function dictionaryByCategory(category: DictionaryEntry['category']): DictionaryEntry[] {
  return DICTIONARY.filter((e) => e.category === category);
}

export function searchDictionary(q: string): DictionaryEntry[] {
  const n = q.trim().toLowerCase();
  if (!n) return DICTIONARY;
  return DICTIONARY.filter((e) =>
    e.gloss.toLowerCase().includes(n) ||
    e.english.toLowerCase().includes(n) ||
    e.category.toLowerCase().includes(n) ||
    e.handshape.toLowerCase().includes(n),
  );
}

export function dictionaryEntryById(id: string): DictionaryEntry | undefined {
  return DICTIONARY.find((e) => e.id === id);
}

export const DICTIONARY_CATEGORIES: DictionaryEntry['category'][] = [
  'greeting', 'common', 'pronoun', 'feelings', 'family', 'food', 'numbers', 'time', 'places', 'verbs', 'question', 'travel', 'medical', 'work', 'emotions',
];
