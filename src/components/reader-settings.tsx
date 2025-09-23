"use client";

import { useTheme } from "./theme-provider";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { SettingsControls } from "./settings-controls";

const FONT_SIZE_STEP = 0.1;
const MIN_FONT_SIZE = 0.8;
const MAX_FONT_SIZE = 2.0;

export function ReaderSettings() {
  const { fontSize, setFontSize } = useTheme();

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(MAX_FONT_SIZE, prev + FONT_SIZE_STEP));
  };
  
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(MIN_FONT_SIZE, prev - FONT_SIZE_STEP));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Appearance</Label>
        <SettingsControls />
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
