"use client";

import { useTheme } from "./theme-provider";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Minus, Plus, Type } from "lucide-react";
import { SettingsControls } from "./settings-controls";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const FONT_SIZE_STEP = 0.1;
const MIN_FONT_SIZE = 0.8;
const MAX_FONT_SIZE = 2.0;

export function ReaderSettings() {
  const { fontSize, setFontSize, font, setFont } = useTheme();

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(MAX_FONT_SIZE, prev + FONT_SIZE_STEP));
  };
  
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(MIN_FONT_SIZE, prev - FONT_SIZE_STEP));
  };

  return (
    <div className="space-y-4 font-sans">
      <div className="space-y-2">
        <Label>Appearance</Label>
        <SettingsControls />
      </div>

      <div className="space-y-2">
        <Label>Font Family</Label>
        <RadioGroup value={font} onValueChange={(value) => setFont(value as "sans" | "serif")} className="flex gap-2">
            <Button asChild variant={font === 'sans' ? 'secondary': 'ghost'} size="sm" className="flex-1">
                <Label htmlFor="font-sans-radio" className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="sans" id="font-sans-radio" className="sr-only"/>
                    <Type className="h-4 w-4"/>
                    Sans-serif
                </Label>
            </Button>
             <Button asChild variant={font === 'serif' ? 'secondary': 'ghost'} size="sm" className="flex-1">
                <Label htmlFor="font-serif-radio" className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="serif" id="font-serif-radio" className="sr-only"/>
                    <span className="font-serif italic text-lg">Aa</span>
                    Serif
                </Label>
            </Button>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-size">Font Size</Label>
        <div className="flex items-center justify-between gap-2">
          <Button id="font-size" variant="outline" size="icon" onClick={decreaseFontSize} disabled={fontSize <= MIN_FONT_SIZE}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium tabular-nums w-12 text-center">
            {Math.round(fontSize * 100)}%
          </span>
          <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={fontSize >= MAX_FONT_SIZE}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
