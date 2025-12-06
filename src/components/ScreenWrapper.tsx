import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  ignoreBottomSafeArea?: boolean; // Set true untuk ignore bottom safe area
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ 
  children, 
  style,
  ignoreBottomSafeArea = false 
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={[
        styles.container, 
        {
          paddingTop: insets.top,
          paddingBottom: ignoreBottomSafeArea ? 0 : insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});