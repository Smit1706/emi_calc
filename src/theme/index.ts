// Theme configuration for EMI Calculator Pro
// Premium design system with dark mode support

export const colors = {
  light: {
    primary: '#F5C518',
    primaryLight: '#FFD93D',
    primaryDark: '#E5B100',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    surfaceElevated: '#FFFFFF',
    text: '#1A1A2E',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    border: '#E5E7EB',
    success: '#10B981',
    error: '#EF4444',
    chartPrincipal: '#F5C518',
    chartInterest: '#E5E7EB',
  },
  dark: {
    primary: '#F5C518',
    primaryLight: '#FFD93D',
    primaryDark: '#E5B100',
    background: '#0F0F1A',
    surface: '#1A1A2E',
    surfaceElevated: '#252542',
    text: '#FFFFFF',
    textSecondary: '#A0AEC0',
    textMuted: '#718096',
    border: '#2D3748',
    success: '#10B981',
    error: '#EF4444',
    chartPrincipal: '#F5C518',
    chartInterest: '#374151',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

export type ThemeMode = 'light' | 'dark';
export type ColorScheme = typeof colors.light;

export const getTheme = (mode: ThemeMode) => ({
  colors: colors[mode],
  spacing,
  borderRadius,
  typography,
  shadows,
});
