
"use client";

import { useState, useCallback } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, BookText, Info } from 'lucide-react';
import { getChapterSummary } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type SummaryItem = {
  phrase: string;
  explanation: string;
  color: string;
};

type ChapterSummaryProps = {
  novelTitle: string;
  chapterNumber: number;
  chapterText: string;
};

const highlightColors: Record<string, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
  green: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
  purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300',
  orange: 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300',
  red: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
};

export function ChapterSummary({ novelTitle, chapterNumber, chapterText }: ChapterSummaryProps) {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);

  const handleSummarize = useCallback(async () => {
    if (isGenerated || isLoading) return;

    setIsLoading(true);
    setError('');
    const result = await getChapterSummary({ novelTitle, chapterNumber, chapterText });
    setIsLoading(false);

    if (result.summary) {
      setSummary(result.summary);
      setIsGenerated(true);
    } else {
      setError(result.error || 'Ocurrió un error desconocido.');
    }
  }, [isGenerated, isLoading, novelTitle, chapterNumber, chapterText]);

  const handleAccordionToggle = (value: string) => {
    if (value === 'summary' && !isGenerated) {
      handleSummarize();
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionToggle}>
      <AccordionItem value="summary">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2 font-semibold">
            <BookText className="h-5 w-5" />
            <span>Resumen del Capítulo</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-2 space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && !isLoading && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {summary.length > 0 && !isLoading && (
             <div className="text-base leading-relaxed space-y-2">
                {summary.map((item, index) => (
                  <Popover key={index}>
                    <PopoverTrigger asChild>
                      <span className={cn("font-medium rounded-md px-1 py-0.5 cursor-pointer transition-colors hover:brightness-95", highlightColors[item.color] || highlightColors.blue)}>
                        {item.phrase}
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 shadow-xl" align="start">
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          Más detalles
                        </h4>
                        <p className="text-sm text-muted-foreground">{item.explanation}</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
             </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
