export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export interface Theme {
  mode: ThemeMode;
  colors: {
    background: string;
    surface: string;
    surfaceElevated: string;
    primary: string;
    primaryContrast: string;
    accent: string;
    danger: string;
    success: string;
    warning: string;
    text: string;
    textMuted: string;
    border: string;
    overlay: string;
  };
  radius: { sm: number; md: number; lg: number; pill: number };
  spacing: (n: number) => number;
}

const baseRadius = { sm: 6, md: 12, lg: 20, pill: 999 };
const baseSpacing = (n: number) => n * 4;

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    background: '#F7F8FB',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    primary: '#3A6DF0',
    primaryContrast: '#FFFFFF',
    accent: '#5CC8A9',
    danger: '#E2445C',
    success: '#18A558',
    warning: '#F5A623',
    text: '#0B132B',
    textMuted: '#5A6A85',
    border: '#E4E8F0',
    overlay: 'rgba(11, 19, 43, 0.45)',
  },
  radius: baseRadius,
  spacing: baseSpacing,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    background: '#0B132B',
    surface: '#131C3A',
    surfaceElevated: '#1B254A',
    primary: '#6C8CFF',
    primaryContrast: '#0B132B',
    accent: '#5CC8A9',
    danger: '#FF6B83',
    success: '#3DDB8A',
    warning: '#FFB74D',
    text: '#F1F3F9',
    textMuted: '#9AA7C7',
    border: '#2A345A',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  radius: baseRadius,
  spacing: baseSpacing,
};

export const highContrastTheme: Theme = {
  mode: 'high-contrast',
  colors: {
    background: '#000000',
    surface: '#000000',
    surfaceElevated: '#111111',
    primary: '#FFFF00',
    primaryContrast: '#000000',
    accent: '#00FFFF',
    danger: '#FF3B30',
    success: '#00FF7F',
    warning: '#FFD60A',
    text: '#FFFFFF',
    textMuted: '#DDDDDD',
    border: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  radius: baseRadius,
  spacing: baseSpacing,
};

export function themeForMode(mode: ThemeMode): Theme {
  if (mode === 'dark') return darkTheme;
  if (mode === 'high-contrast') return highContrastTheme;
  return lightTheme;
}
