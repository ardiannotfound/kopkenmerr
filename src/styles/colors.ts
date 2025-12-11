// src/styles/colors.ts

/**
 * Color Scheme Type
 * Dipakai oleh Light & Dark theme agar tidak terjadi konflik literal types
 */
export interface ColorScheme {
  primary: string;
  primaryDark: string;
  primaryLight: string;

  secondary: string;
  secondaryLight: string;
  accent: string;

  success: string;
  warning: string;
  error: string;
  info: string;

  white: string;
  black: string;

  gray: Record<number, string>;

  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    light: string;
  };

  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
  };

  border: {
    default: string;
    light: string;
    dark: string;
  };

  button: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    info: string;
    process: string;
  };

  ticket: {
    pengaduan: {
      background: string;
      text: string;
    };
    permintaan: {
      background: string;
      text: string;
    };
  };

  status: {
    dikerjakan: string;
    pending: string;
    selesai: string;
    disetujui: string;
    closed: string;
  };

  onboarding: {
    dotActive: string;
    dotInactive: string;
  };

  link: string;

  bottomBar: {
    background: string;
    icon: string;
  };

  sectionTitle: {
    background: string;
    text: string;
  };
}

/**
 * Light Colors
 */
export const Colors: ColorScheme = {
  primary: '#053F5C',
  primaryDark: '#042D42',
  primaryLight: '#0A3D62',

  secondary: '#337CAD',
  secondaryLight: '#429EBD',
  accent: '#FFA629',

  success: '#4FEA17',
  warning: '#FF9500',
  error: '#D32F2F',
  info: '#0099FF',

  white: '#FFFFFF',
  black: '#000000',

  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  text: {
    primary: '#263238',
    secondary: '#555657',
    tertiary: '#000000', // Use with Opacity.placeholder (37%)
    light: '#FFFFFF',
  },

  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#E9ECEF',
    card: '#FFFFFF',
  },

  border: {
    default: '#E5E2E2',
    light: '#E0E7EF',
    dark: '#D9D9D9',
  },

  button: {
    primary: '#053F5C',
    secondary: '#E0E7EF',
    success: '#2FA84F',
    warning: '#FF9500',
    info: '#C64747',
    process: '#0E638C',
  },

  ticket: {
    pengaduan: {
      background: 'rgba(255, 166, 41, 0.5)', // FFA629 50%
      text: '#FF9500',
    },
    permintaan: {
      background: 'rgba(51, 124, 173, 0.3)', // 337CAD 30%
      text: '#337CAD',
    },
  },

  status: {
    dikerjakan: '#053F5C',
    pending: '#555657',
    selesai: '#4FEA17',
    disetujui: '#0099FF',
    closed: '#D32F2F',
  },

  onboarding: {
    dotActive: '#FFA629',
    dotInactive: '#D9D9D9',
  },

  link: '#429EBD',

  bottomBar: {
    background: '#E9ECEF',
    icon: '#053F5C',
  },

  sectionTitle: {
    background: '#FFA629',
    text: '#053F5C',
  },
};

/**
 * Dark Colors
 */
export const DarkColors: ColorScheme = {
  primary: '#053F5C',
  primaryDark: '#042D42',
  primaryLight: '#0A3D62',

  secondary: '#337CAD',
  secondaryLight: '#429EBD',
  accent: '#FFA629',

  success: '#4FEA17',
  warning: '#FF9500',
  error: '#D32F2F',
  info: '#0099FF',

  white: '#FFFFFF',
  black: '#000000',

  gray: {
    50: '#111827',
    100: '#1F2937',
    200: '#374151',
    300: '#4B5563',
    400: '#6B7280',
    500: '#9CA3AF',
    600: '#D1D5DB',
    700: '#E5E7EB',
    800: '#F3F4F6',
    900: '#F9FAFB',
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#E5E7EB',
    tertiary: '#FFFFFF', // Use with Opacity.placeholder (37%)
    light: '#FFFFFF',
  },

  background: {
    primary: '#1F2937',
    secondary: '#111827',
    tertiary: '#374151',
    card: '#2D3748',
  },

  border: {
    default: '#4B5563',
    light: '#374151',
    dark: '#6B7280',
  },

  button: {
    primary: '#053F5C',
    secondary: '#374151',
    success: '#2FA84F',
    warning: '#FF9500',
    info: '#C64747',
    process: '#0E638C',
  },

  ticket: {
    pengaduan: {
      background: 'rgba(255, 166, 41, 0.5)',
      text: '#FF9500',
    },
    permintaan: {
      background: 'rgba(51, 124, 173, 0.3)',
      text: '#337CAD',
    },
  },

  status: {
    dikerjakan: '#053F5C',
    pending: '#555657',
    selesai: '#4FEA17',
    disetujui: '#0099FF',
    closed: '#D32F2F',
  },

  onboarding: {
    dotActive: '#FFA629',
    dotInactive: '#6B7280', // More visible in dark mode
  },

  link: '#429EBD',

  bottomBar: {
    background: '#1F2937',
    icon: '#FFFFFF',
  },

  sectionTitle: {
    background: '#FFA629',
    text: '#FFFFFF', // Better contrast in dark mode
  },
};

/**
 * Opacity values
 */
export const Opacity = {
  placeholder: 0.37, // 37% untuk placeholder text
  disabled: 0.5,
  pressed: 0.7,
  overlay: 0.8,
} as const;

/**
 * Helper function untuk apply opacity ke hex color
 * @param hexColor - Hex color string (e.g., '#000000')
 * @param opacity - Opacity value (0-1)
 * @returns Hex color dengan alpha channel (e.g., '#0000005E')
 */
export const applyOpacity = (hexColor: string, opacity: number): string => {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
  return `${hexColor}${alpha}`;
};

/**
 * Helper untuk get placeholder color dengan opacity
 */
export const getPlaceholderColor = (baseColor: string): string => {
  return applyOpacity(baseColor, Opacity.placeholder);
};

export type ColorPalette = ColorScheme;
export type ColorKey = keyof ColorScheme;