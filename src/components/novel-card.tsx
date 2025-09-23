'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Novel } from '@/lib/types';
import { useLibrary, useReadingProgress } from '@/lib/hooks';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type NovelCardProps = {
  novel: Novel;
};

export function NovelCard({ novel }: NovelCardProps) {
  const { library, addToLibrary, removeFromLibrary } = useLibrary();
  const { progress } = useReadingProgress();

  const isSaved = library.includes(novel.id);
  const novelProgress = progress[novel.id];

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      removeFromLibrary(novel.id);
    } else {
      addToLibrary(novel.id);
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative group">
        <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
          <Link href={`/novels/${novel.id}`}>
              <CardContent className="p-0">
                <div className="aspect-[2/3] relative">
                  <Image
                    src={novel.coverImageUrl}
                    alt={`Cover of ${novel.title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                </div>
              </CardContent>
          </Link>
        </Card>
        <div className="mt-3 space-y-1">
          <h3 className="font-semibold text-sm leading-tight truncate" title={novel.title}>
            {novel.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate" title={novel.author}>
            {novel.author}
          </p>
          {novelProgress && (
            <Button asChild size="sm" className="w-full mt-2">
              <Link href={`/novels/${novel.id}/${novelProgress.chapterId}`}>
                Continue Reading
              </Link>
            </Button>
          )}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleBookmarkClick}
              aria-label={isSaved ? 'Remove from library' : 'Save to library'}
            >
              <Bookmark className={cn("h-4 w-4", isSaved ? "fill-primary text-primary" : "text-foreground")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSaved ? 'Remove from library' : 'Save to library'}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
