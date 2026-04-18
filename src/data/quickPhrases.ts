import type { QuickPhrase } from '@/types';

export const QUICK_PHRASES: QuickPhrase[] = [
  { id: 'qp-hello', text: 'Hello, nice to meet you.', category: 'greeting' },
  { id: 'qp-howru', text: 'How are you?', category: 'greeting' },
  { id: 'qp-name', text: 'My name is…', category: 'greeting' },
  { id: 'qp-thanks', text: 'Thank you very much.', category: 'social' },
  { id: 'qp-sorry', text: 'I am sorry.', category: 'social' },
  { id: 'qp-help', text: 'Can you help me, please?', category: 'need' },
  { id: 'qp-repeat', text: 'Please repeat that more slowly.', category: 'need' },
  { id: 'qp-writeit', text: 'Could you write it down?', category: 'need' },
  { id: 'qp-water', text: 'I would like some water.', category: 'need' },
  { id: 'qp-restroom', text: 'Where is the restroom?', category: 'travel' },
  { id: 'qp-directions', text: 'How do I get to…?', category: 'travel' },
  { id: 'qp-pain', text: 'I am in pain.', category: 'medical' },
  { id: 'qp-allergic', text: 'I am allergic to…', category: 'medical' },
  { id: 'qp-deaf', text: 'I am deaf. Please face me when you speak.', category: 'social' },
];
