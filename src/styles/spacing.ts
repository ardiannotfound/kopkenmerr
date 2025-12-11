// src/styles/spacing.ts
import { Dimensions, PixelRatio, Platform } from 'react-native';

/**
 * Screen Dimensions
 */
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Base dimensions (design reference)
 * iPhone 11 Pro sebagai baseline standard
 */
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Responsive scaling functions
 * Membuat UI konsisten di berbagai ukuran device
 */

/**
 * Scale berdasarkan lebar screen
 * Cocok untuk horizontal spacing, width
 */
export const horizontalScale = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Scale berdasarkan tinggi screen
 * Cocok untuk vertical spacing, height
 */
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Moderate scale - hybrid approach
 * Cocok untuk font size agar tidak terlalu besar di device besar
 * @param size - ukuran base
 * @param factor - faktor moderasi (default 0.3 - lebih konservatif untuk tablet)
 */
export const moderateScale = (size: number, factor: number = 0.35): number => {
  return size + (horizontalScale(size) - size) * factor;
};

/**
 * Responsive font size dengan batas min/max
 */
export const responsiveFontSize = (
  size: number,
  minSize?: number,
  maxSize?: number
): number => {
  const scaled = moderateScale(size);
  
  if (minSize && scaled < minSize) return minSize;
  if (maxSize && scaled > maxSize) return maxSize;
  
  return scaled;
};

/**
 * Normalize pixel untuk konsistensi di berbagai density
 */
export const normalize = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

/**
 * Spacing System (8pt grid system)
 * Menggunakan kelipatan 8 untuk konsistensi
 */
export const Spacing = {
  xs: horizontalScale(4),
  sm: horizontalScale(8),
  md: horizontalScale(16),
  lg: horizontalScale(24),
  xl: horizontalScale(32),
  '2xl': horizontalScale(40),
  '3xl': horizontalScale(48),
  '4xl': horizontalScale(64),
} as const;

/**
 * Vertical Spacing (untuk margin/padding vertical)
 */
export const VerticalSpacing = {
  xs: verticalScale(4),
  sm: verticalScale(8),
  md: verticalScale(16),
  lg: verticalScale(24),
  xl: verticalScale(32),
  '2xl': verticalScale(40),
  '3xl': verticalScale(48),
  '4xl': verticalScale(64),
} as const;

/**
 * Border Radius
 */
export const BorderRadius = {
  none: 0,
  xs: moderateScale(2),
  sm: moderateScale(4),
  md: moderateScale(8),
  lg: moderateScale(12),
  xl: moderateScale(16),
  '2xl': moderateScale(24),
  full: 9999,
} as const;

/**
 * Border Width
 */
export const BorderWidth = {
  hairline: PixelRatio.roundToNearestPixel(0.5),
  thin: 1,
  base: 2,
  thick: 3,
} as const;

/**
 * Icon Sizes
 */
export const IconSize = {
  xs: moderateScale(12),
  sm: moderateScale(16),
  md: moderateScale(20),
  lg: moderateScale(24),
  xl: moderateScale(32),
  '2xl': moderateScale(40),
  '3xl': moderateScale(48),
} as const;

/**
 * Button Heights
 */
export const ButtonHeight = {
  sm: verticalScale(32),
  md: verticalScale(44),
  lg: verticalScale(56),
} as const;

/**
 * Input Heights
 */
export const InputHeight = {
  sm: verticalScale(36),
  md: verticalScale(44),
  lg: verticalScale(52),
} as const;

/**
 * Container Widths (untuk tablet/larger screens)
 */
export const ContainerWidth = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/**
 * Shadow Definitions (platform-specific)
 */
export const Shadow = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

/**
 * Screen Breakpoints
 */
export const Breakpoints = {
  phone: SCREEN_WIDTH < 600,
  tablet: SCREEN_WIDTH >= 600 && SCREEN_WIDTH < 1024,
  desktop: SCREEN_WIDTH >= 1024,
} as const;

/**
 * Helper untuk check device type berdasarkan tinggi
 */
export const isSmallDevice = SCREEN_HEIGHT < 700;
export const isMediumDevice = SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;
export const isLargeDevice = SCREEN_HEIGHT >= 900;

/**
 * Device Type Helper berdasarkan lebar
 */
export const DeviceType = {
  isPhone: Breakpoints.phone,
  isTablet: Breakpoints.tablet,
  isDesktop: Breakpoints.desktop,
} as const;

/**
 * Safe Area Insets
 * NOTE: Ini adalah fallback values. 
 * Gunakan useSafeAreaInsets() dari react-native-safe-area-context di component
 * untuk mendapatkan nilai aktual device.
 */
export const SafeAreaFallback = {
  top: Platform.select({
    ios: 44, // iPhone notch standard
    android: 24, // Status bar standard
    default: 0,
  }),
  bottom: Platform.select({
    ios: 34, // iPhone home indicator
    android: 0,
    default: 0,
  }),
  left: 0,
  right: 0,
} as const;

/**
 * Export screen dimensions
 */
export const ScreenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  baseWidth: BASE_WIDTH,
  baseHeight: BASE_HEIGHT,
} as const;

/**
 * Width Percentage Helper
 */
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

/**
 * Height Percentage Helper
 */
export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Minimum Touch Target Size (Accessibility)
 */
export const MIN_TOUCH_SIZE = 44;

/**
 * Helper: Ensure minimum touch size
 */
export const ensureTouchSize = (size: number): number => {
  return Math.max(size, MIN_TOUCH_SIZE);
};

/**
 * Helper Types
 */
export type SpacingKey = keyof typeof Spacing;
export type VerticalSpacingKey = keyof typeof VerticalSpacing;
export type BorderRadiusKey = keyof typeof BorderRadius;
export type IconSizeKey = keyof typeof IconSize;
export type ShadowKey = keyof typeof Shadow;