// src/styles/theme.ts

import { Colors, DarkColors, Opacity } from './colors';
import type { ColorScheme } from './colors';

import { Typography, FontFamily, FontSize } from './typography';

import {
  Spacing,
  VerticalSpacing,
  BorderRadius,
  BorderWidth,
  IconSize,
  ButtonHeight,
  InputHeight,
  Shadow,
  Breakpoints,
  ScreenDimensions,
} from './spacing';

/**
 * Theme Type Definition
 */
export interface Theme {
  dark: boolean;
  colors: ColorScheme;        // ⬅️ FIX DI SINI
  typography: typeof Typography;
  fontFamily: typeof FontFamily;
  fontSize: typeof FontSize;
  spacing: typeof Spacing;
  verticalSpacing: typeof VerticalSpacing;
  borderRadius: typeof BorderRadius;
  borderWidth: typeof BorderWidth;
  iconSize: typeof IconSize;
  buttonHeight: typeof ButtonHeight;
  inputHeight: typeof InputHeight;
  shadow: typeof Shadow;
  opacity: typeof Opacity;
  breakpoints: typeof Breakpoints;
  screenDimensions: typeof ScreenDimensions;
}

/**
 * Light Theme
 */
export const LightTheme: Theme = {
  dark: false,
  colors: Colors, // OK
  typography: Typography,
  fontFamily: FontFamily,
  fontSize: FontSize,
  spacing: Spacing,
  verticalSpacing: VerticalSpacing,
  borderRadius: BorderRadius,
  borderWidth: BorderWidth,
  iconSize: IconSize,
  buttonHeight: ButtonHeight,
  inputHeight: InputHeight,
  shadow: Shadow,
  opacity: Opacity,
  breakpoints: Breakpoints,
  screenDimensions: ScreenDimensions,
};

/**
 * Dark Theme
 */
export const DarkTheme: Theme = {
  dark: true,
  colors: DarkColors, // OK
  typography: Typography,
  fontFamily: FontFamily,
  fontSize: FontSize,
  spacing: Spacing,
  verticalSpacing: VerticalSpacing,
  borderRadius: BorderRadius,
  borderWidth: BorderWidth,
  iconSize: IconSize,
  buttonHeight: ButtonHeight,
  inputHeight: InputHeight,
  shadow: Shadow,
  opacity: Opacity,
  breakpoints: Breakpoints,
  screenDimensions: ScreenDimensions,
};

/**
 * Default Theme
 */
export const DefaultTheme = LightTheme;

/**
 * Helper untuk pilih theme mode
 */
export const getTheme = (isDark: boolean): Theme =>
  isDark ? DarkTheme : LightTheme;

/**
 * Constants
 */
export const ThemeConstants = {
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    pressed: 0.6,
  },
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
} as const;

/**
 * Specific Component Styles
 */
export const ComponentStyles = {
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.md,
  },
  input: {
    height: InputHeight.md,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: BorderWidth.thin,
  },
  button: {
    primary: {
      height: ButtonHeight.md,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg,
    },
    secondary: {
      height: ButtonHeight.md,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg,
      borderWidth: BorderWidth.thin,
    },
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  bottomBar: {
    height: ButtonHeight.lg,
    paddingBottom: Spacing.xs,
  },
  sectionTitleBar: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
} as const;

/**
 * Re-exports
 */
export {
  Colors,
  DarkColors,
  Opacity,
  Typography,
  FontFamily,
  FontSize,
  Spacing,
  VerticalSpacing,
  BorderRadius,
  BorderWidth,
  IconSize,
  ButtonHeight,
  InputHeight,
  Shadow,
  Breakpoints,
  ScreenDimensions,
};

/**
 * Type exports
 */
export type ThemeMode = 'light' | 'dark';
export type TypographyScheme = typeof Typography;
