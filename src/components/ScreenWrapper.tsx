// src/components/ScreenWrapper.tsx
import React from 'react';
import { View, KeyboardAvoidingView, Platform, ViewStyle, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext_OLD';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  translucentStatusBar?: boolean;
}

export default function ScreenWrapper({ 
  children, 
  style, 
  backgroundColor,
  translucentStatusBar = false 
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode } = useTheme();

  const bg = backgroundColor || colors.background;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: bg, 
        paddingTop: insets.top,
        paddingBottom: insets.bottom 
      }
    ]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={translucentStatusBar ? 'transparent' : bg}
        translucent={translucentStatusBar}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[{ flex: 1 }, style]}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});