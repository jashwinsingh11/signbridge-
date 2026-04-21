import type { QuickPhrase } from '@/types';

export const QUICK_PHRASES: QuickPhrase[] = [
  // Greetings (10)
  { id: 'qp-hello', text: 'Hello, nice to meet you.', category: 'greeting' },
  { id: 'qp-howru', text: 'How are you?', category: 'greeting' },
  { id: 'qp-name', text: 'My name is…', category: 'greeting' },
  { id: 'qp-goodmorning', text: 'Good morning.', category: 'greeting' },
  { id: 'qp-goodevening', text: 'Good evening.', category: 'greeting' },
  { id: 'qp-goodbye', text: 'Goodbye, have a great day.', category: 'greeting' },
  { id: 'qp-longtime', text: 'Long time no see!', category: 'greeting' },
  { id: 'qp-howsday', text: 'How is your day going?', category: 'greeting' },
  { id: 'qp-welcome', text: 'Welcome!', category: 'greeting' },
  { id: 'qp-seeyou', text: 'See you soon.', category: 'greeting' },

  // Social (10)
  { id: 'qp-thanks', text: 'Thank you very much.', category: 'social' },
  { id: 'qp-sorry', text: 'I am sorry.', category: 'social' },
  { id: 'qp-excuseme', text: 'Excuse me.', category: 'social' },
  { id: 'qp-pleasure', text: 'My pleasure.', category: 'social' },
  { id: 'qp-wait', text: 'Please wait a moment.', category: 'social' },
  { id: 'qp-understood', text: 'I understand.', category: 'social' },
  { id: 'qp-notunderstand', text: 'I do not understand.', category: 'social' },
  { id: 'qp-deaf', text: 'I am deaf. Please face me when you speak.', category: 'social' },
  { id: 'qp-slowly', text: 'Could you speak a little slower?', category: 'social' },
  { id: 'qp-okay', text: 'That is okay.', category: 'social' },

  // Need (10)
  { id: 'qp-help', text: 'Can you help me, please?', category: 'need' },
  { id: 'qp-repeat', text: 'Please repeat that more slowly.', category: 'need' },
  { id: 'qp-writeit', text: 'Could you write it down?', category: 'need' },
  { id: 'qp-interpreter', text: 'I need an interpreter.', category: 'need' },
  { id: 'qp-water', text: 'I would like some water.', category: 'need' },
  { id: 'qp-coffee', text: 'A coffee, please.', category: 'need' },
  { id: 'qp-food', text: 'I am hungry.', category: 'need' },
  { id: 'qp-restroomneed', text: 'I need to use the restroom.', category: 'need' },
  { id: 'qp-charge', text: 'May I charge my phone?', category: 'need' },
  { id: 'qp-wifi', text: 'Is there Wi-Fi here?', category: 'need' },

  // Travel (10)
  { id: 'qp-restroom', text: 'Where is the restroom?', category: 'travel' },
  { id: 'qp-directions', text: 'How do I get to…?', category: 'travel' },
  { id: 'qp-ticket', text: 'I would like a ticket to…', category: 'travel' },
  { id: 'qp-lost', text: 'I am lost. Can you help me?', category: 'travel' },
  { id: 'qp-taxi', text: 'Please call me a taxi.', category: 'travel' },
  { id: 'qp-airport', text: 'Where is the airport?', category: 'travel' },
  { id: 'qp-hotel', text: 'Can you recommend a hotel?', category: 'travel' },
  { id: 'qp-menu', text: 'May I see the menu?', category: 'travel' },
  { id: 'qp-bill', text: 'Could I have the bill, please?', category: 'travel' },
  { id: 'qp-train', text: 'Which platform for the train?', category: 'travel' },

  // Medical (8)
  { id: 'qp-pain', text: 'I am in pain.', category: 'medical' },
  { id: 'qp-allergic', text: 'I am allergic to…', category: 'medical' },
  { id: 'qp-doctor', text: 'I need to see a doctor.', category: 'medical' },
  { id: 'qp-pharmacy', text: 'Where is the nearest pharmacy?', category: 'medical' },
  { id: 'qp-medication', text: 'I take medication daily.', category: 'medical' },
  { id: 'qp-dizzy', text: 'I feel dizzy.', category: 'medical' },
  { id: 'qp-bleeding', text: 'I am bleeding.', category: 'medical' },
  { id: 'qp-hurt', text: 'I am hurt.', category: 'medical' },
];
