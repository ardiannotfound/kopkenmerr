import { useThemeStore } from '../store/themeStore';
import { getTheme, Theme, ThemeMode } from '../styles/theme';

export const useTheme = () => {
  const { isDark, toggleTheme } = useThemeStore();
  
  // Ambil objek tema lengkap
  const theme: Theme = getTheme(isDark);
  
  return {
    theme,       
    isDark,      
    themeMode: (isDark ? 'dark' : 'light') as ThemeMode, 
    toggleTheme,
    
    // ✅ TAMBAHKAN SHORTCUT INI AGAR ERROR HILANG:
    colors: theme.colors,
    spacing: theme.spacing,
    typography: theme.typography
  };
};

// Helper hooks lainnya biarkan saja...
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

export const useThemeTypography = () => {
  const { theme } = useTheme();
  return theme.typography;
};

export const useThemeSpacing = () => {
  const { theme } = useTheme();
  return {
    spacing: theme.spacing,
    verticalSpacing: theme.verticalSpacing,
  };
};