// src/styles/typography.ts
import { TextStyle } from 'react-native';
import { moderateScale } from './spacing';

/**
 * Font Family Definitions
 */
export const FontFamily = {
  // Poppins variants
  poppins: {
    light: 'Poppins-Light',
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semibold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  // Khmer Sleokchher untuk logo
  khmer: 'KhmerSleokchher-Regular',
} as const;

/**
 * Font Sizes (responsive dengan moderateScale)
 */
export const FontSize = {
  xs: moderateScale(10),
  sm: moderateScale(12),
  base: moderateScale(14),
  md: moderateScale(16),
  lg: moderateScale(18),
  xl: moderateScale(20),
  '2xl': moderateScale(24),
  '3xl': moderateScale(28),
  '4xl': moderateScale(32),
  '5xl': moderateScale(36),
  logo: moderateScale(40), // untuk logo SILADAN
} as const;

/**
 * Line Heights
 */
export const LineHeight = {
  tight: 1.3,    // ✅ Increased dari 1.2 → 1.3
  normal: 1.5,   // ✅ Keep
  relaxed: 1.75, // ✅ Keep
  loose: 2,      // ✅ Keep
} as const;

/**
 * Letter Spacing
 */
export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

/**
 * Predefined Text Styles
 * Sesuai dengan design SILADAN
 */
export const Typography = {
  // Logo Style (Splash Screen)
  logo: {
    fontFamily: FontFamily.khmer,
    fontSize: FontSize.logo,
    lineHeight: FontSize.logo * LineHeight.tight,
    includeFontPadding: false,
  } as TextStyle,

  // Headings
  h1: {
    fontFamily: FontFamily.poppins.bold,
    fontSize: FontSize['4xl'],
    lineHeight: FontSize['4xl'] * LineHeight.tight,
    includeFontPadding: false,
  } as TextStyle,

  h2: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize['3xl'],
    lineHeight: FontSize['3xl'] * LineHeight.tight,
    includeFontPadding: false,
  } as TextStyle,

  h3: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.normal,
    includeFontPadding: false,
  } as TextStyle,

  h4: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.normal,
    includeFontPadding: false,
  } as TextStyle,

  h5: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.normal,
    includeFontPadding: false,
  } as TextStyle,

  h6: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.normal,
    includeFontPadding: false,
  } as TextStyle,

  // Body Text
  bodyLarge: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.relaxed,
    includeFontPadding: false,
  } as TextStyle,

  body: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.relaxed,
    includeFontPadding: false,
  } as TextStyle,

  bodySmall: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
    includeFontPadding: false,
  } as TextStyle,

  // Caption / Helper Text
  caption: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.normal,
    includeFontPadding: false,
  } as TextStyle,

  // Button Text
  button: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.tight,
    includeFontPadding: false,
    textTransform: 'none' as const,
  } as TextStyle,

  buttonMedium: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.tight,
    includeFontPadding: false,
  } as TextStyle,

  // Onboarding Styles
  onboardingTitle: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.tight,
    includeFontPadding: false,
  } as TextStyle,

  onboardingDescription: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.relaxed,
    includeFontPadding: false,
  } as TextStyle,

  onboardingSkip: {
    fontFamily: FontFamily.poppins.light,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
    includeFontPadding: false,
  } as TextStyle,

  onboardingNext: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
    includeFontPadding: false,
  } as TextStyle,

  // Link Text
  link: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
    includeFontPadding: false,
    textDecorationLine: 'underline' as const,
  } as TextStyle,

  // Label Text (for forms)
  label: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
    includeFontPadding: false,
  } as TextStyle,

  // Placeholder Text
  placeholder: {
    fontFamily: FontFamily.poppins.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
    includeFontPadding: false,
  } as TextStyle,

  // Title Bar / Section Header
  sectionTitle: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.tight,
    includeFontPadding: false,
  } as TextStyle,

  // Badge / Tag Text
  badge: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.tight,
    includeFontPadding: false,
  } as TextStyle,

  // Tab Text
  tab: {
    fontFamily: FontFamily.poppins.medium,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.tight,
    includeFontPadding: false,
  } as TextStyle,

  tabActive: {
    fontFamily: FontFamily.poppins.semibold,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.tight,
    includeFontPadding: false,
  } as TextStyle,
} as const;

/**
 * Helper function untuk membuat custom text style
 */
export const createTextStyle = (
  family: keyof typeof FontFamily.poppins | 'khmer',
  size: keyof typeof FontSize,
  lineHeightMultiplier: keyof typeof LineHeight = 'normal'
): TextStyle => {
  const fontFamily = family === 'khmer' 
    ? FontFamily.khmer 
    : FontFamily.poppins[family];
  
  const fontSize = FontSize[size];
  const lineHeight = fontSize * LineHeight[lineHeightMultiplier];

  return {
    fontFamily,
    fontSize,
    lineHeight,
  };
};

export type TypographyKey = keyof typeof Typography;