
"use client";

import { useState, useCallback } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, BookText } from 'lucide-react';
import { getChapterSummary } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type ChapterSummaryProps = {
  novelTitle: string;
  chapterNumber: number;
  chapterText: string;
};

export function ChapterSummary({ novelTitle, chapterNumber, chapterText }: ChapterSummaryProps) {
  const [summary, setSummary] = useState('');
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
        <AccordionContent className="pt-4 space-y-4">
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
          {summary && !isLoading && (
            <p className="text-base leading-relaxed">{summary}</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
