import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Languages, Loader2, RefreshCcw } from 'lucide-react';
import { getChapterTranslation } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Label } from './ui/label';

const languages = [
    { code: "en", name: "Inglés" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Francés" },
    { code: "de", name: "Alemán" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Portugués" },
    { code: "nl", name: "Holandés" },
    { code: "ru", name: "Ruso" },
    { code: "zh-CN", name: "Chino (Simplificado)" },
    { code: "ja", name: "Japonés" },
    { code: "ko", name: "Coreano" },
    { code: "ar", name: "Árabe" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengalí" },
    { code: "pa", name: "Panyabí" },
    { code: "jv", name: "Javanés" },
    { code: "ms", name: "Malayo" },
    { code: "vi", name: "Vietnamita" },
    { code: "th", name: "Tailandés" },
    { code: "tr", name: "Turco" },
    { code: "pl", name: "Polaco" },
    { code: "ro", name: "Rumano" },
    { code: "sv", name: "Sueco" },
    { code: "fi", name: "Finlandés" },
    { code: "no", name: "Noruego" },
    { code: "da", name: "Danés" },
    { code: "el", name: "Griego" },
    { code: "he", name: "Hebreo" },
    { code: "id", name: "Indonesio" },
    { code: "uk", name: "Ucraniano" },
    { code: "hu", name: "Húngaro" },
];


type ChapterTranslatorProps = {
  chapterText: string;
  onContentChange: (newContent: string) => void;
  isTranslated: boolean;
};

export function ChapterTranslator({ chapterText, onContentChange, isTranslated }: ChapterTranslatorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const handleTranslate = async () => {
    if (!selectedLanguage) {
      setError('Por favor, selecciona un idioma.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    const result = await getChapterTranslation(chapterText, selectedLanguage);
    setIsLoading(false);
    
    if (result.translatedText) {
      onContentChange(result.translatedText);
      setIsOpen(false);
    } else {
      setError(result.error || 'Ocurrió un error desconocido.');
    }
  };

  const showOriginal = () => {
    onContentChange(chapterText);
    setSelectedLanguage('');
    setError('');
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Traducir capítulo">
          <Languages className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Traducir Capítulo</h4>
            <p className="text-sm text-muted-foreground">
              Selecciona un idioma para traducir el capítulo.
            </p>
          </div>

          {isTranslated ? (
            <Button onClick={showOriginal} variant="outline">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Mostrar Texto Original
            </Button>
          ) : (
            <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="language" className="col-span-1">Idioma</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger id="language" className="col-span-2 h-8">
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map(lang => (
                                <SelectItem key={lang.code} value={lang.name}>
                                    {lang.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <Button onClick={handleTranslate} disabled={isLoading || !selectedLanguage}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                    Traducir
                </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="text-xs">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

        </div>
      </PopoverContent>
    </Popover>
  );
}