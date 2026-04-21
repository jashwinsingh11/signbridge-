export interface Handshape {
  id: string;
  label: string;
  category: 'alphabet' | 'number' | 'classifier';
  description: string;
  usedIn: string[];
  tip?: string;
}

export const HANDSHAPES: Handshape[] = [
  { id: 'hs-a', label: 'A', category: 'alphabet', description: 'Closed fist, thumb alongside the index finger.', usedIn: ['NAME', 'APPLE', 'YESTERDAY'], tip: 'Keep the thumb relaxed.' },
  { id: 'hs-b', label: 'B', category: 'alphabet', description: 'Flat hand, fingers together, thumb across the palm.', usedIn: ['BLUE', 'BUS', 'BAD'] },
  { id: 'hs-c', label: 'C', category: 'alphabet', description: 'Curved hand forming a "C".', usedIn: ['CUP', 'COOKIE', 'CAT'] },
  { id: 'hs-d', label: 'D', category: 'alphabet', description: 'Index up; thumb meets middle, ring, pinky.', usedIn: ['DOOR', 'DOCTOR'] },
  { id: 'hs-e', label: 'E', category: 'alphabet', description: 'All fingertips curled to thumb.', usedIn: ['EMERGENCY'] },
  { id: 'hs-f', label: 'F', category: 'alphabet', description: 'Index-thumb circle, three fingers up.', usedIn: ['FAMILY', 'FRANCE'] },
  { id: 'hs-g', label: 'G', category: 'alphabet', description: 'Index and thumb parallel and horizontal.', usedIn: ['GO', 'GREEN'] },
  { id: 'hs-h', label: 'H', category: 'alphabet', description: 'Index and middle fingers together, horizontal.', usedIn: ['HOSPITAL', 'HOUR'] },
  { id: 'hs-i', label: 'I', category: 'alphabet', description: 'Pinky up, other fingers closed.', usedIn: ['ICE-CREAM'] },
  { id: 'hs-l', label: 'L', category: 'alphabet', description: 'Index up, thumb out at 90°.', usedIn: ['LUCK', 'LATE'] },
  { id: 'hs-o', label: 'O', category: 'alphabet', description: 'Fingers curl to thumb forming an O.', usedIn: ['OPEN', 'OK'] },
  { id: 'hs-s', label: 'S', category: 'alphabet', description: 'Closed fist, thumb across fingers.', usedIn: ['STORE', 'SIT'] },
  { id: 'hs-v', label: 'V', category: 'alphabet', description: 'Index and middle spread in a "V".', usedIn: ['VICTORY', 'VISIT'] },
  { id: 'hs-w', label: 'W', category: 'alphabet', description: 'Thumb holds pinky; three fingers up.', usedIn: ['WATER', 'WORLD'] },
  { id: 'hs-y', label: 'Y', category: 'alphabet', description: 'Thumb and pinky extended, other fingers curled.', usedIn: ['PLAY', 'YELLOW', 'TODAY'] },
  { id: 'hs-1', label: '1', category: 'number', description: 'Index finger up.', usedIn: ['ONE', 'I', 'YOU'] },
  { id: 'hs-3', label: '3', category: 'number', description: 'Thumb, index, middle up.', usedIn: ['THREE', 'CAT'] },
  { id: 'hs-5', label: '5', category: 'number', description: 'All five fingers spread.', usedIn: ['FIVE', 'MOTHER', 'FATHER'] },
  { id: 'hs-claw', label: 'Claw', category: 'classifier', description: 'Curved fingers like a claw.', usedIn: ['ANGRY', 'WANT'] },
  { id: 'hs-flat-o', label: 'Flat-O', category: 'classifier', description: 'All fingertips meet the thumb, palm flat.', usedIn: ['EAT', 'HOME'] },
  { id: 'hs-bent', label: 'Bent', category: 'classifier', description: 'Fingers bent at the knuckles, palm open.', usedIn: ['TIRED', 'NIGHT'] },
];
