"use client";

import { Moon, Sun, CaseSensitive } from 'lucide-react';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

export function SettingsControls() {
  const { theme, setTheme, font, setFont } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Tabs value={font} onValueChange={(value) => setFont(value as 'sans' | 'serif')} className="w-[100px]">
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="sans" className="text-xs">Sans</TabsTrigger>
          <TabsTrigger value="serif" className="text-xs font-serif">Serif</TabsTrigger>
        </TabsList>
      </Tabs>

      <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}
