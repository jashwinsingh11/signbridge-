export type SignLanguageCode = 'ASL' | 'BSL' | 'ISL' | 'FSL' | 'Auslan' | 'LSF';

export interface SignLanguage {
  code: SignLanguageCode;
  name: string;
  region: string;
  voiceLocale: string;
}

export type SpokenLocale = 'en-US' | 'en-GB' | 'hi-IN' | 'es-ES' | 'fj-FJ';

export interface SpokenLanguage {
  locale: SpokenLocale;
  name: string;
  nativeName: string;
}

export interface DetectedSign {
  id: string;
  gloss: string;
  confidence: number;
  timestampMs: number;
  language: SignLanguageCode;
}

export interface DetectionFrame {
  signs: DetectedSign[];
  sentenceBuffer: string;
  fps: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: SignLanguageCode;
  estimatedMinutes: number;
  steps: LessonStep[];
}

export interface LessonStep {
  id: string;
  gloss: string;
  instruction: string;
  tip?: string;
  phonetic?: string;
}

export interface PracticeAttempt {
  lessonId: string;
  stepId: string;
  gloss: string;
  confidence: number;
  correct: boolean;
  timestampMs: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  earnedAt?: number;
  icon: string;
}

export interface ConversationTurn {
  id: string;
  speaker: 'me' | 'them';
  mode: 'sign' | 'voice';
  text: string;
  gloss?: string;
  language: SignLanguageCode | SpokenLocale;
  confidence?: number;
  timestampMs: number;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  turns: ConversationTurn[];
}

export interface QuickPhrase {
  id: string;
  text: string;
  category: 'greeting' | 'need' | 'medical' | 'travel' | 'social' | 'custom';
}

export interface EmergencyPhrase {
  id: string;
  text: string;
  severity: 'high' | 'critical';
}

export interface CustomGesture {
  id: string;
  gloss: string;
  description: string;
  createdAt: number;
  sampleCount: number;
}

export interface UserProfile {
  id: string;
  displayName: string;
  preferredSignLanguage: SignLanguageCode;
  preferredSpokenLocale: SpokenLocale;
  badges: Badge[];
  practiceHistory: PracticeAttempt[];
  customGestures: CustomGesture[];
  vocabularyFrequency: Record<string, number>;
}

export interface AccessibilitySettings {
  voiceNavigation: boolean;
  hapticsEnabled: boolean;
  audioDescriptions: boolean;
  screenReaderAnnouncements: boolean;
  reduceMotion: boolean;
  fontScale: number;
  themeMode: 'light' | 'dark' | 'high-contrast' | 'system';
  signingSpeed: number;
  avatarStyle: 'classic' | 'modern' | 'minimal';
  avatarSkinTone: 'light' | 'medium' | 'dark';
}

export interface AvatarAnimationCue {
  gloss: string;
  durationMs: number;
  handshape: string;
  phonetic?: string;
}
