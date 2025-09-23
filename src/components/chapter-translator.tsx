"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Languages, Loader2 } from 'lucide-react';
import { getChapterTranslation } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';

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
};

export function ChapterTranslator({ chapterText }: ChapterTranslatorProps) {
  const [translatedText, setTranslatedText] = useState('');
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
    setTranslatedText('');
    const result = await getChapterTranslation(chapterText, selectedLanguage);
    setIsLoading(false);
    if (result.translatedText) {
      setTranslatedText(result.translatedText);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Translate chapter">
          <Languages className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Translate Chapter</DialogTitle>
          <DialogDescription>
            Select a language to translate the entire chapter. This uses AI and may not be 100% accurate.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map(lang => (
                            <SelectItem key={lang.code} value={lang.name}>
                                {lang.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleTranslate} disabled={isLoading || !selectedLanguage}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                    Translate
                </Button>
            </div>
            {error && (
                <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {translatedText && (
                <ScrollArea className="h-72 w-full rounded-md border p-4">
                     <p className="text-sm text-muted-foreground">{translatedText}</p>
                </ScrollArea>
            )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
