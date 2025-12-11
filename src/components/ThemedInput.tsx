// src/components/ThemedInput.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '../context/ThemeContext_OLD';
import ThemedText from './ThemedText';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  error?: string; // Support pesan error merah
}

export default function ThemedInput({ label, error, style, ...props }: ThemedInputProps) {
  const { colors, isDarkMode } = useTheme();
  
  const isReadOnly = props.editable === false;

  const bg = isReadOnly 
    ? (isDarkMode ? '#2C2C2C' : '#F5F5F5') 
    : colors.inputBg;

  const borderColor = error ? colors.danger : colors.border;
  const textColor = isReadOnly ? colors.subText : colors.text;
  const placeholderColor = isDarkMode ? '#666' : '#B0B0B0';

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText variant="label" style={{ marginLeft: 4 }}>
          {label}
        </ThemedText>
      )}
      
      <View style={[
        styles.inputWrapper,
        props.multiline && styles.textAreaWrapper,
        { 
          backgroundColor: bg, 
          borderColor: borderColor 
        }
      ]}>
        <TextInput
          placeholderTextColor={placeholderColor}
          style={[
            styles.input,
            props.multiline && styles.textAreaInput,
            { color: textColor },
            style
          ]}
          {...props}
        />
      </View>

      {error && (
        <ThemedText variant="caption" color={colors.danger} style={{ marginTop: 4, marginLeft: 4 }}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  inputWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, 
    shadowRadius: 2, 
    elevation: 1,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: RFValue(14),
    paddingHorizontal: 15, 
    height: 52, // Tinggi nyaman untuk jari
  },
  textAreaWrapper: { height: 120 },
  textAreaInput: { height: '100%', paddingTop: 12, textAlignVertical: 'top' },
});