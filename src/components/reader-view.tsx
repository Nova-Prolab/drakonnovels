"use client";

import type { Novel, Chapter } from '@/lib/types';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, Home, Settings, List } from 'lucide-react';
import Link from 'next/link';
import { ChapterSummary } from './chapter-summary';
import { ReaderSettings } from './reader-settings';
import { useReadingProgress } from '@/lib/hooks';
import { useEffect, useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import Image from 'next/image';
import { ChapterTranslator } from './chapter-translator';
import { useLoading } from './loading-provider';

type ReaderViewProps = {
  novel: Novel;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
};

export function ReaderView({ novel, chapter, prevChapter, nextChapter }: ReaderViewProps) {
  const { fontSize, font, isThemeReady, lineHeight, columnWidth, textAlign } = useTheme();
  const { updateProgress } = useReadingProgress();
  const { startLoading } = useLoading();
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayedContent, setDisplayedContent] = useState(chapter.content);

  // Reset content when chapter changes
  useEffect(() => {
    setDisplayedContent(chapter.content);
  }, [chapter.content]);


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

  const handleContentChange = (newContent: string) => {
    setDisplayedContent(newContent);
    if(contentRef.current) {
        contentRef.current.scrollTop = 0;
    }
  }

  const fontClass = 
    font === 'serif' ? 'font-serif' : 
    font === 'merriweather' ? 'font-merriweather' :
    font === 'lato' ? 'font-lato' :
    'font-sans';

  return (
    <div className={cn("bg-background text-foreground", isThemeReady ? fontClass : 'font-sans')}>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 overflow-hidden">
             <Button asChild variant="ghost" size="icon" aria-label="Back to home">
              <Link href="/">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3 overflow-hidden">
              {novel.coverImageUrl && (
                <Link href={`/novels/${novel.id}`} className="relative h-10 w-8 flex-shrink-0">
                  <Image src={novel.coverImageUrl} alt={`${novel.title} cover`} fill className="object-cover rounded-sm" />
                </Link>
              )}
              <div className="flex flex-col overflow-hidden">
                 <Link href={`/novels/${novel.id}`} className="text-sm font-semibold truncate" title={novel.title}>{novel.title}</Link>
                <h2 className="text-xs text-muted-foreground truncate" title={chapter.title}>{chapter.title}</h2>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ChapterTranslator 
                chapterText={chapter.content} 
                onContentChange={handleContentChange} 
                isTranslated={displayedContent !== chapter.content}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Reading settings">
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <ReaderSettings />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <div className="flex flex-col">
        <main ref={contentRef} className="flex-1">
          <div className={cn("container mx-auto px-4 py-8 md:py-12", columnWidth)}>
            <div 
              className={cn("prose prose-lg dark:prose-invert", textAlign === "justify" && "text-justify")}
              style={{ 
                fontSize: `${fontSize}rem`,
                lineHeight: lineHeight
              }}
            >
              <h1>{chapter.title}</h1>
              <div className="my-8">
                <ChapterSummary novelTitle={novel.title} chapterNumber={chapter.id} chapterText={chapter.content} />
              </div>
              {displayedContent.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
              ))}
            </div>

            <footer className="mt-12 border-t pt-6">
                <div className="flex justify-between gap-2">
                  <div className="flex-1 flex justify-start">
                    {prevChapter && (
                      <Button asChild variant="outline" className="w-full sm:w-auto" title="Previous Chapter">
                        <Link onClick={startLoading} href={`/novels/${novel.id}/${prevChapter.id}`}>
                          <ArrowLeft className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Previous</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-none">
                    <Button asChild variant="secondary" title="All Chapters" className="w-full">
                        <Link onClick={startLoading} href={`/novels/${novel.id}/chapters`}>
                            <List className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">All Chapters</span>
                        </Link>
                    </Button>
                  </div>

                  <div className="flex-1 flex justify-end">
                    {nextChapter && (
                      <Button asChild variant="outline" className="w-full sm:w-auto" title="Next Chapter">
                        <Link onClick={startLoading} href={`/novels/${novel.id}/${nextChapter.id}`}>
                          <span className="hidden sm:inline">Next</span>
                          <ArrowRight className="h-4 w-4 sm:ml-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
