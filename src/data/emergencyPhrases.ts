import type { EmergencyPhrase } from '@/types';

export const EMERGENCY_PHRASES: EmergencyPhrase[] = [
  { id: 'em-call-911', text: 'Please call emergency services now.', severity: 'critical' },
  { id: 'em-medical', text: 'I need medical help. I cannot hear.', severity: 'critical' },
  { id: 'em-allergy', text: 'I am having a severe allergic reaction.', severity: 'critical' },
  { id: 'em-heart', text: 'I think I am having a heart attack.', severity: 'critical' },
  { id: 'em-asthma', text: 'I cannot breathe. I need my inhaler.', severity: 'critical' },
  { id: 'em-lost', text: 'I am lost and need help.', severity: 'high' },
  { id: 'em-unsafe', text: 'I do not feel safe. Please stay with me.', severity: 'high' },
  { id: 'em-translate', text: 'Please use text to communicate with me.', severity: 'high' },
];
