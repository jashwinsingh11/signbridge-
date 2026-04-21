import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  'en-US': {
    app: {
      name: 'SignBridge',
      tagline: 'Sign language translation for everyone.',
    },
    tabs: {
      home: 'Home',
      detect: 'Detect',
      speak: 'Speak',
      learn: 'Learn',
      chat: 'Talk',
      profile: 'You',
    },
    common: {
      start: 'Start',
      stop: 'Stop',
      pause: 'Pause',
      next: 'Next',
      back: 'Back',
      done: 'Done',
      retry: 'Retry',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      loading: 'Loading…',
      confidence: 'Confidence',
    },
  },
  'hi-IN': {
    app: { name: 'साइनब्रिज', tagline: 'सभी के लिए सांकेतिक भाषा अनुवाद।' },
    tabs: { home: 'होम', detect: 'पहचान', speak: 'बोलें', learn: 'सीखें', chat: 'बात', profile: 'आप' },
    common: {
      start: 'शुरू', stop: 'रोकें', pause: 'रुकें', next: 'अगला', back: 'वापस', done: 'पूर्ण',
      retry: 'पुनः', cancel: 'रद्द', save: 'सहेजें', delete: 'हटाएँ', loading: 'लोड हो रहा है…', confidence: 'विश्वास',
    },
  },
  'es-ES': {
    app: { name: 'SignBridge', tagline: 'Traducción de lengua de signos para todos.' },
    tabs: { home: 'Inicio', detect: 'Detectar', speak: 'Hablar', learn: 'Aprender', chat: 'Hablar', profile: 'Tú' },
    common: {
      start: 'Iniciar', stop: 'Detener', pause: 'Pausar', next: 'Siguiente', back: 'Atrás', done: 'Hecho',
      retry: 'Reintentar', cancel: 'Cancelar', save: 'Guardar', delete: 'Eliminar', loading: 'Cargando…', confidence: 'Confianza',
    },
  },
};

export const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'en-US';

const deviceLocales = getLocales();
const tag = deviceLocales[0]?.languageTag ?? 'en-US';
i18n.locale = tag.startsWith('hi') ? 'hi-IN' : tag.startsWith('es') ? 'es-ES' : 'en-US';

export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

export function setAppLocale(locale: string): void {
  i18n.locale = locale;
}
