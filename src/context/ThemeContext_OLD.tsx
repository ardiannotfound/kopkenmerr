import React, { createContext, useState, useContext } from 'react';

// 1. Definisikan Warna
export const lightColors = {
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#333333',
  subText: '#666666',
  primary: '#007AFF',
  border: '#eeeeee',
  icon: '#333333',
};

export const darkColors = {
  background: '#121212',
  card: '#1e1e1e', // Abu gelap untuk kartu
  text: '#ffffff',
  subText: '#aaaaaa',
  primary: '#0a84ff', // Biru yg lebih terang dikit biar kontras
  border: '#333333',
  icon: '#ffffff',
};

// 2. Buat Context
const ThemeContext = createContext<any>(null);

// 3. Provider (Pembungkus Aplikasi)
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 4. Custom Hook biar gampang dipanggil
export const useTheme = () => useContext(ThemeContext);