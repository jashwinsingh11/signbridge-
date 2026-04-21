import type { EmergencyPhrase } from '@/types';

export const EMERGENCY_PHRASES: EmergencyPhrase[] = [
  { id: 'em-911', text: 'Please call emergency services now.', severity: 'critical' },
  { id: 'em-cpr', text: 'I need CPR. Please help.', severity: 'critical' },
  { id: 'em-fire', text: 'There is a fire. Evacuate immediately.', severity: 'critical' },
  { id: 'em-chest', text: 'I am having chest pain.', severity: 'critical' },
  { id: 'em-breathe', text: 'I cannot breathe. I need my inhaler.', severity: 'critical' },
  { id: 'em-allergy', text: 'I am having an allergic reaction. EpiPen is in my bag.', severity: 'critical' },
  { id: 'em-stroke', text: 'I may be having a stroke. I need help now.', severity: 'critical' },
  { id: 'em-unconscious', text: 'Someone is unconscious. Call an ambulance.', severity: 'critical' },
  { id: 'em-injury', text: 'I am seriously injured. Please stay with me.', severity: 'high' },
  { id: 'em-deaf', text: 'I am deaf. Please write or sign to communicate.', severity: 'high' },
  { id: 'em-diabetic', text: 'I am diabetic. I may need sugar immediately.', severity: 'high' },
  { id: 'em-allergy-food', text: 'I am severely allergic to peanuts. Do not give me food.', severity: 'high' },
  { id: 'em-lost-child', text: 'I cannot find my child. Please help.', severity: 'high' },
];
