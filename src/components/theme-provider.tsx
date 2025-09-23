"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/lib/hooks';

type Theme = 'light' | 'dark';
type Font = 'sans' | 'serif';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  font: Font;
  setFont: (font: Font) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useLocalStorage<Theme>('theme', 'dark');
  const [fontSize, setFontSize] = useLocalStorage<number>('font-size', 1.0);
  const [font, setFontState] = useLocalStorage<Font>('font', 'serif');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, [setThemeState]);
  
  const setFont = useCallback((newFont: Font) => {
    setFontState(newFont);
  }, [setFontState]);


  useEffect(() => {
    if (isMounted) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);

      const body = window.document.body;
      body.classList.remove('font-sans', 'font-serif');
      // We apply font-sans to the body for UI elements, reader view will override it.
      body.classList.add('font-sans');
    }
  }, [theme, isMounted]);

  const value = {
    theme: theme,
    setTheme,
    fontSize: fontSize,
    setFontSize: setFontSize as React.Dispatch<React.SetStateAction<number>>,
    font: font,
    setFont,
  };

  return (
    <ThemeContext.Provider value={value}>
        {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
