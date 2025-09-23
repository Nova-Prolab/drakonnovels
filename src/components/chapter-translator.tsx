"use client";

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
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "nl", name: "Dutch" },
    { code: "ru", name: "Russian" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "bn", name: "Bengali" },
    { code: "pa", name: "Punjabi" },
    { code: "jv", name: "Javanese" },
    { code: "ms", name: "Malay" },
    { code: "vi", name: "Vietnamese" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "pl", name: "Polish" },
    { code: "ro", name: "Romanian" },
    { code: "sv", name: "Swedish" },
    { code: "fi", name: "Finnish" },
    { code: "no", name: "Norwegian" },
    { code: "da", name: "Danish" },
    { code: "el", name: "Greek" },
    { code: "he", name: "Hebrew" },
    { code: "id", name: "Indonesian" },
    { code: "uk", name: "Ukrainian" },
    { code: "hu", name: "Hungarian" },
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
      setError('Please select a language.');
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
      setError(result.error || 'An unknown error occurred.');
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
        <Button variant="ghost" size="icon" aria-label="Translate chapter">
          <Languages className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Translate Chapter</h4>
            <p className="text-sm text-muted-foreground">
              Select a language to translate the chapter.
            </p>
          </div>

          {isTranslated ? (
            <Button onClick={showOriginal} variant="outline">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Show Original Text
            </Button>
          ) : (
            <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="language" className="col-span-1">Language</Label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger id="language" className="col-span-2 h-8">
                            <SelectValue placeholder="Select" />
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
                    Translate
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
