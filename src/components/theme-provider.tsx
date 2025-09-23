
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/lib/hooks';

type Theme = 'light' | 'dark' | 'sepia';
type Font = 'sans' | 'serif' | 'merriweather' | 'lato';
type TextAlign = 'left' | 'justify';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  font: Font;
  setFont: (font: Font) => void;
  lineHeight: number;
  setLineHeight: React.Dispatch<React.SetStateAction<number>>;
  columnWidth: string;
  setColumnWidth: React.Dispatch<React.SetStateAction<string>>;
  textAlign: TextAlign;
  setTextAlign: (align: TextAlign) => void;
  isThemeReady: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState, isThemeReady] = useLocalStorage<Theme>('theme', 'dark');
  const [fontSize, setFontSize, isFontSizeReady] = useLocalStorage<number>('font-size', 1.0);
  const [font, setFontState, isFontReady] = useLocalStorage<Font>('font', 'serif');
  const [lineHeight, setLineHeight, isLineHeightReady] = useLocalStorage<number>('line-height', 1.7);
  const [columnWidth, setColumnWidth, isColumnWidthReady] = useLocalStorage<string>('column-width', 'max-w-3xl');
  const [textAlign, setTextAlignState, isTextAlignReady] = useLocalStorage<TextAlign>('text-align', 'left');

  const isReady = isThemeReady && isFontSizeReady && isFontReady && isLineHeightReady && isColumnWidthReady && isTextAlignReady;

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, [setThemeState]);
  
  const setFont = useCallback((newFont: Font) => {
    setFontState(newFont);
  }, [setFontState]);

  const setTextAlign = useCallback((newAlign: TextAlign) => {
    setTextAlignState(newAlign);
  }, [setTextAlignState]);


  useEffect(() => {
    if (isReady) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark', 'sepia');
      root.classList.add(theme);

      const body = window.document.body;
      body.classList.remove('font-sans', 'font-serif');
      // We apply font-sans to the body for UI elements, reader view will override it.
      body.classList.add('font-sans');
    }
  }, [theme, isReady]);

  const value = {
    theme,
    setTheme,
    fontSize: fontSize,
    setFontSize: setFontSize as React.Dispatch<React.SetStateAction<number>>,
    font,
    setFont,
    lineHeight,
    setLineHeight: setLineHeight as React.Dispatch<React.SetStateAction<number>>,
    columnWidth,
    setColumnWidth: setColumnWidth as React.Dispatch<React.SetStateAction<string>>,
    textAlign,
    setTextAlign,
    isThemeReady: isReady,
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
