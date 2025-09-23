"use client";

import type { Novel, Chapter } from '@/lib/types';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, Home, Settings, Languages } from 'lucide-react';
import Link from 'next/link';
import { ChapterSummary } from './chapter-summary';
import { ReaderSettings } from './reader-settings';
import { useReadingProgress } from '@/lib/hooks';
import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import Image from 'next/image';
import { ChapterTranslator } from './chapter-translator';

type ReaderViewProps = {
  novel: Novel;
  chapter: Chapter;
  coverImageUrl?: string;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
};

export function ReaderView({ novel, chapter, coverImageUrl, prevChapter, nextChapter }: ReaderViewProps) {
  const { fontSize, font } = useTheme();
  const { updateProgress } = useReadingProgress();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        updateProgress(novel.id, chapter.id, scrollPercentage);
      }
    };
    
    const contentElement = contentRef.current;
    contentElement?.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      contentElement?.removeEventListener('scroll', handleScroll);
    };
  }, [novel.id, chapter.id, updateProgress]);

  return (
    <div className={cn("bg-background text-foreground font-sans", isMounted && (font === 'serif' ? 'font-serif' : 'font-sans'))}>
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 overflow-hidden">
             <Button asChild variant="ghost" size="icon" aria-label="Back to library">
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3 overflow-hidden">
              {coverImageUrl && (
                <div className="relative h-10 w-8 flex-shrink-0">
                  <Image src={coverImageUrl} alt={`${novel.title} cover`} fill className="object-cover rounded-sm" />
                </div>
              )}
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-sm font-semibold truncate" title={novel.title}>{novel.title}</h1>
                <h2 className="text-xs text-muted-foreground truncate" title={chapter.title}>Chapter {chapter.id}: {chapter.title}</h2>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <ChapterTranslator chapterText={chapter.content} />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Reading settings">
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <ReaderSettings />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <main ref={contentRef} className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
          <div className="prose prose-lg dark:prose-invert" style={{ fontSize: `${fontSize}rem` }}>
            <h1>Chapter {chapter.id}: {chapter.title}</h1>
            <div className="my-8">
              <ChapterSummary novelTitle={novel.title} chapterNumber={chapter.id} chapterText={chapter.content} />
            </div>
            {chapter.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12 flex justify-between border-t pt-6">
            {prevChapter ? (
              <Button asChild variant="outline">
                <Link href={`/novels/${novel.id}/${prevChapter.id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Link>
              </Button>
            ) : <div />}
            {nextChapter ? (
              <Button asChild variant="outline">
                <Link href={`/novels/${novel.id}/${nextChapter.id}`}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : <div />}
          </div>
        </div>
      </main>
    </div>
  );
}
