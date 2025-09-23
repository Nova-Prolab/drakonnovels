"use client";

import type { Novel, Chapter } from '@/lib/types';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight, Home, List, Settings } from 'lucide-react';
import Link from 'next/link';
import { ChapterSummary } from './chapter-summary';
import { ReaderSettings } from './reader-settings';
import { useReadingProgress } from '@/lib/hooks';
import { useEffect, useRef, useState, useMemo, memo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import Image from 'next/image';
import { ChapterTranslator } from './chapter-translator';
import { useLoading } from './loading-provider';
import { ChapterAudioPlayer } from './chapter-audio-player';
import { Skeleton } from './ui/skeleton';
import { Lora, Merriweather, Lato } from 'next/font/google';

const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather'});
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato'});


type ReaderViewProps = {
  novel: Novel;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
};

const HighlightedParagraph = memo(function HighlightedParagraph({
  paragraph,
  isCurrentlyPlaying,
  spokenCharIndex,
}: {
  paragraph: string;
  isCurrentlyPlaying: boolean;
  spokenCharIndex: number;
}) {
  const wordsAndSpaces = useMemo(() => {
    return paragraph.split(/(\s+)/);
  }, [paragraph]);

  if (!isCurrentlyPlaying) {
    return <p>{paragraph}</p>;
  }

  let charCount = 0;
  return (
    <p className={cn("transition-colors duration-300 rounded-md", "bg-accent")}>
      {wordsAndSpaces.map((wordOrSpace, index) => {
        const wordStart = charCount;
        const currentWordLength = wordOrSpace.length;
        charCount += currentWordLength;
        
        if (wordOrSpace.trim() === '') {
          return <span key={index}>{wordOrSpace}</span>;
        }

        const isSpoken = spokenCharIndex >= wordStart && spokenCharIndex < (wordStart + currentWordLength);

        return (
          <span
            key={index}
            className={cn(
              "transition-colors duration-150",
              isSpoken && "bg-primary/30 rounded"
            )}
          >
            {wordOrSpace}
          </span>
        );
      })}
    </p>
  );
});

export function ClientReaderView({ novel, chapter, prevChapter, nextChapter }: ReaderViewProps) {
  const { fontSize, font, isThemeReady, lineHeight, columnWidth, textAlign } = useTheme();
  const { updateCurrentChapter } = useReadingProgress();
  const { startLoading } = useLoading();
  
  const mainRef = useRef<HTMLElement>(null);
  
  const [displayedContent, setDisplayedContent] = useState(chapter.content);
  const [currentlyPlayingParagraph, setCurrentlyPlayingParagraph] = useState(-1);
  const [spokenCharIndex, setSpokenCharIndex] = useState(-1);

  useEffect(() => {
    updateCurrentChapter(novel.id, chapter.id);
  }, [novel.id, chapter.id, updateCurrentChapter]);

  useEffect(() => {
    setDisplayedContent(chapter.content);
    setCurrentlyPlayingParagraph(-1); // Reset highlight on chapter change
    setSpokenCharIndex(-1);
    if(mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [chapter.id, chapter.content]);

  const handleContentChange = (newContent: string) => {
    setDisplayedContent(newContent);
    if(mainRef.current) {
        mainRef.current.scrollTop = 0;
    }
  }
  
  const paragraphs = useMemo(() => displayedContent.split('\n').filter(p => p.trim() !== ''), [displayedContent]);

  const fontFamilies: { [key: string]: string } = {
    sans: 'font-sans',
    serif: 'font-serif',
    merriweather: 'font-merriweather',
    lato: 'font-lato'
  };
  const fontClass = fontFamilies[font] || 'font-sans';
  
  if (!isThemeReady) {
    return (
      <div className="h-screen flex flex-col">
        <header className="border-b flex-shrink-0 z-10">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
             <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
             </div>
             <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
             </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
           <div className="container mx-auto px-4 py-8 md:py-12">
              <Skeleton className="h-10 w-3/4 mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
           </div>
        </main>
      </div>
    )
  }

  return (
    <div className={cn("bg-background text-foreground h-screen flex flex-col", fontClass, lora.variable, merriweather.variable, lato.variable)}>
      <header className="border-b bg-background/80 backdrop-blur-sm flex-shrink-0 z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 overflow-hidden">
             <Button asChild variant="ghost" size="icon" aria-label="Volver a inicio">
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
            <ChapterAudioPlayer 
              chapterText={chapter.content} 
              onParagraphChange={setCurrentlyPlayingParagraph}
              onBoundary={setSpokenCharIndex}
            />

            <ChapterTranslator 
                chapterText={chapter.content} 
                onContentChange={handleContentChange} 
                isTranslated={displayedContent !== chapter.content}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Ajustes de lectura">
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

      <main ref={mainRef} className="flex-1 overflow-y-auto">
          <div 
            className={cn("container mx-auto px-4 py-8 md:py-12 transition-all duration-300", columnWidth)}>
            <div 
              className={cn("prose prose-lg dark:prose-invert max-w-none", textAlign === "justify" && "text-justify")}
              style={{ 
                fontSize: `${fontSize}rem`,
                lineHeight: lineHeight
              }}
            >
              <h1>{chapter.title}</h1>
              <div className="my-8">
                <ChapterSummary novelTitle={novel.title} chapterNumber={chapter.id} chapterText={chapter.content} />
              </div>
              {paragraphs.map((paragraph, index) => (
                  <HighlightedParagraph
                    key={index}
                    paragraph={paragraph}
                    isCurrentlyPlaying={index === currentlyPlayingParagraph}
                    spokenCharIndex={spokenCharIndex}
                  />
              ))}
            </div>

            <footer className="mt-12 border-t pt-6">
                <div className="flex justify-between gap-2">
                  <div className="flex-1 flex justify-start">
                    {prevChapter && (
                      <Button asChild variant="outline" className="w-full sm:w-auto" title="Capítulo Anterior">
                        <Link onClick={startLoading} href={`/novels/${novel.id}/${prevChapter.id}`}>
                          <ArrowLeft className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Anterior</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex-none">
                    <Button asChild variant="secondary" title="Todos los Capítulos" className="w-full">
                        <Link onClick={startLoading} href={`/novels/${novel.id}/chapters`}>
                            <List className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Todos los Capítulos</span>
                        </Link>
                    </Button>
                  </div>

                  <div className="flex-1 flex justify-end">
                    {nextChapter && (
                      <Button asChild variant="outline" className="w-full sm:w-auto" title="Capítulo Siguiente">
                        <Link onClick={startLoading} href={`/novels/${novel.id}/${nextChapter.id}`}>
                          <span className="hidden sm:inline">Siguiente</span>
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
  );
}
