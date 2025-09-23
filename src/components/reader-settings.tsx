import { useTheme } from "./theme-provider";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Minus, Plus, Type, AlignLeft, AlignJustify, CaseSensitive, Columns, Sun, Moon } from "lucide-react";
import { SettingsControls } from "./settings-controls";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";

const FONT_SIZE_STEP = 0.1;
const MIN_FONT_SIZE = 0.8;
const MAX_FONT_SIZE = 2.0;

const LINE_HEIGHT_STEP = 0.1;
const MIN_LINE_HEIGHT = 1.2;
const MAX_LINE_HEIGHT = 2.2;

const columnWidths = [
  { value: "max-w-xl", label: "Estrecho" },
  { value: "max-w-3xl", label: "Normal" },
  { value: "max-w-5xl", label: "Ancho" },
];

function SepiaIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <rect width="256" height="256" fill="none" />
      <path d="M128,216S28,160,28,104a100,100,0,0,1,200,0C228,160,128,216,128,216Z" opacity="0.2" />
      <path d="M128,216S28,160,28,104a100,100,0,0,1,200,0C228,160,128,216,128,216Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
    </svg>
  );
}


export function ReaderSettings() {
  const { 
    fontSize, setFontSize, 
    font, setFont,
    theme, setTheme,
    lineHeight, setLineHeight,
    columnWidth, setColumnWidth,
    textAlign, setTextAlign,
  } = useTheme();

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(MAX_FONT_SIZE, prev + FONT_SIZE_STEP));
  };
  
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(MIN_FONT_SIZE, prev - FONT_SIZE_STEP));
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="space-y-2">
        <Label>Apariencia</Label>
        <RadioGroup value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "sepia")} className="flex gap-1">
            <Button asChild variant={theme === 'light' ? 'secondary': 'ghost'} size="sm" className="flex-1">
                <Label htmlFor="theme-light-radio" className="flex items-center gap-2 cursor-pointer h-full w-full justify-center">
                    <RadioGroupItem value="light" id="theme-light-radio" className="sr-only"/>
                    <Sun />
                </Label>
            </Button>
            <Button asChild variant={theme === 'dark' ? 'secondary': 'ghost'} size="sm" className="flex-1">
                <Label htmlFor="theme-dark-radio" className="flex items-center gap-2 cursor-pointer h-full w-full justify-center">
                    <RadioGroupItem value="dark" id="theme-dark-radio" className="sr-only"/>
                    <Moon />
                </Label>
            </Button>
            <Button asChild variant={theme === 'sepia' ? 'secondary': 'ghost'} size="sm" className="flex-1">
                <Label htmlFor="theme-sepia-radio" className="flex items-center gap-2 cursor-pointer h-full w-full justify-center">
                    <RadioGroupItem value="sepia" id="theme-sepia-radio" className="sr-only"/>
                    <SepiaIcon className="w-5 h-5"/>
                </Label>
            </Button>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Familia de Fuente</Label>
        <Select value={font} onValueChange={(value) => setFont(value as "sans" | "serif" | "merriweather" | "lato")}>
            <SelectTrigger>
                <SelectValue placeholder="Seleccionar fuente" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="sans">
                    <span className="font-sans">Inter (Sans-serif)</span>
                </SelectItem>
                <SelectItem value="serif">
                    <span className="font-serif">Lora (Serif)</span>
                </SelectItem>
                 <SelectItem value="merriweather">
                    <span style={{fontFamily: 'var(--font-merriweather)'}}>Merriweather</span>
                </SelectItem>
                <SelectItem value="lato">
                    <span style={{fontFamily: 'var(--font-lato)'}}>Lato</span>
                </SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-size" className="flex items-center justify-between">
          <span>Tamaño de Fuente</span>
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {Math.round(fontSize * 100)}%
          </span>
        </Label>
        <div className="flex items-center justify-between gap-2">
          <Button id="font-size" variant="outline" size="icon" onClick={decreaseFontSize} disabled={fontSize <= MIN_FONT_SIZE}>
            <Minus className="h-4 w-4" />
          </Button>
          <Slider 
            value={[fontSize]}
            onValueChange={([val]) => setFontSize(val)}
            min={MIN_FONT_SIZE}
            max={MAX_FONT_SIZE}
            step={FONT_SIZE_STEP / 2}
            className="flex-1"
          />
          <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={fontSize >= MAX_FONT_SIZE}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="line-height" className="flex items-center justify-between">
            <span>Interlineado</span>
            <span className="text-sm font-medium tabular-nums text-muted-foreground">
              {lineHeight.toFixed(1)}
            </span>
        </Label>
        <Slider 
            id="line-height"
            value={[lineHeight]}
            onValueChange={([val]) => setLineHeight(val)}
            min={MIN_LINE_HEIGHT}
            max={MAX_LINE_HEIGHT}
            step={LINE_HEIGHT_STEP}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label>Justificación</Label>
            <RadioGroup value={textAlign} onValueChange={(value) => setTextAlign(value as "left" | "justify")} className="flex gap-1">
                <Button asChild variant={textAlign === 'left' ? 'secondary': 'ghost'} size="icon" className="flex-1">
                    <Label htmlFor="align-left-radio" className="flex items-center gap-2 cursor-pointer h-full w-full justify-center">
                        <RadioGroupItem value="left" id="align-left-radio" className="sr-only"/>
                        <AlignLeft />
                    </Label>
                </Button>
                <Button asChild variant={textAlign === 'justify' ? 'secondary': 'ghost'} size="icon" className="flex-1">
                    <Label htmlFor="align-justify-radio" className="flex items-center gap-2 cursor-pointer h-full w-full justify-center">
                        <RadioGroupItem value="justify" id="align-justify-radio" className="sr-only"/>
                        <AlignJustify />
                    </Label>
                </Button>
            </RadioGroup>
        </div>
         <div className="space-y-2">
            <Label>Ancho</Label>
            <RadioGroup value={columnWidth} onValueChange={setColumnWidth} className="flex gap-1">
                {columnWidths.map(width => (
                     <Button asChild key={width.value} variant={columnWidth === width.value ? 'secondary': 'ghost'} size="icon" className="flex-1">
                        <Label htmlFor={`width-${width.value}-radio`} className="flex items-center gap-2 cursor-pointer h-full w-full justify-center">
                            <RadioGroupItem value={width.value} id={`width-${width.value}-radio`} className="sr-only"/>
                            <Columns className={cn(
                              width.value === "max-w-xl" ? "w-3" : width.value === "max-w-3xl" ? "w-4" : "w-5"
                            )}/>
                        </Label>
                    </Button>
                ))}
            </RadioGroup>
        </div>
      </div>

    </div>
  );
}
