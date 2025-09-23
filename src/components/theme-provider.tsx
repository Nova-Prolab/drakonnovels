"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/lib/hooks';

type Theme = 'light' | 'dark';
type Font = 'sans' | 'serif';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  font: Font;
  setFont: (font: Font | ((prevFont: Font) => Font)) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useLocalStorage<Theme>('theme', 'light');
  const [font, setFont] = useLocalStorage<Font>('font', 'sans');
  const [fontSize, setFontSize] = useLocalStorage<number>('font-size', 1.0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, [setThemeState]);

  useEffect(() => {
    if (isMounted) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);

      const body = window.document.body;
      body.classList.remove('font-sans', 'font-serif');
      body.classList.add(font === 'serif' ? 'font-serif' : 'font-sans');
    }
  }, [theme, font, isMounted]);

  const value = {
    theme: theme,
    setTheme,
    font: font,
    setFont: setFont as (font: Font | ((prevFont: Font) => Font)) => void,
    fontSize: fontSize,
    setFontSize: setFontSize as React.Dispatch<React.SetStateAction<number>>,
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
