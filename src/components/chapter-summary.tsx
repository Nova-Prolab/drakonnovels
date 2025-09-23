"use client";

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
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

  const handleSummarize = async () => {
    setIsLoading(true);
    setError('');
    const result = await getChapterSummary({ novelTitle, chapterNumber, chapterText });
    setIsLoading(false);
    if (result.summary) {
      setSummary(result.summary);
      setIsGenerated(true);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="summary">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span>AI Chapter Summary</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4 space-y-4">
          {!isGenerated && !isLoading && (
            <div className="flex flex-col items-center justify-center space-y-4 text-center p-4 border rounded-lg bg-card text-card-foreground">
                <p className="text-sm text-muted-foreground">Get a quick summary of this chapter.</p>
                <Button onClick={handleSummarize}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Summary
                </Button>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {summary && (
            <p className="text-base leading-relaxed">{summary}</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
