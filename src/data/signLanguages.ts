import type { SignLanguage, SpokenLanguage } from '@/types';

export const SIGN_LANGUAGES: SignLanguage[] = [
  { code: 'ASL', name: 'American Sign Language', region: 'United States, Canada', voiceLocale: 'en-US' },
  { code: 'BSL', name: 'British Sign Language', region: 'United Kingdom', voiceLocale: 'en-GB' },
  { code: 'ISL', name: 'Indian Sign Language', region: 'India', voiceLocale: 'hi-IN' },
  { code: 'FSL', name: 'Fijian Sign Language', region: 'Fiji', voiceLocale: 'fj-FJ' },
  { code: 'Auslan', name: 'Australian Sign Language', region: 'Australia', voiceLocale: 'en-GB' },
  { code: 'LSF', name: 'Langue des Signes Française', region: 'France', voiceLocale: 'fr-FR' },
];

export const SPOKEN_LANGUAGES: SpokenLanguage[] = [
  { locale: 'en-US', name: 'English (US)', nativeName: 'English' },
  { locale: 'en-GB', name: 'English (UK)', nativeName: 'English' },
  { locale: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { locale: 'es-ES', name: 'Spanish', nativeName: 'Español' },
  { locale: 'fj-FJ', name: 'Fijian', nativeName: 'Vosa Vakaviti' },
];

export function signLanguageByCode(code: string): SignLanguage | undefined {
  return SIGN_LANGUAGES.find((l) => l.code === code);
}
