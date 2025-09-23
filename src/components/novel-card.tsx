
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Novel } from '@/lib/types';
import { useLibrary, useReadingProgress } from '@/lib/hooks';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Bookmark, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { useLoading } from './loading-provider';

type NovelCardProps = {
  novel: Novel;
  isCarouselItem?: boolean;
};

const getAgeRatingColor = (ageRating?: string) => {
  if (!ageRating) return 'bg-gray-500';
  switch (ageRating.toLowerCase()) {
    case 'mature':
      return 'bg-red-600';
    case 'teen':
      return 'bg-amber-500';
    case 'all ages':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

export function NovelCard({ novel, isCarouselItem = false }: NovelCardProps) {
  const { library, addToLibrary, removeFromLibrary } = useLibrary();
  const { progress } = useReadingProgress();
  const { startLoading } = useLoading();

  const isSaved = library.includes(novel.id);
  const novelProgress = progress[novel.id];
  const startChapter = novel.chapters[0]?.id ?? 1;

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
      <div className={cn("relative group transition-transform duration-500 ease-in-out", !isCarouselItem && "hover:[transform:rotateY(10deg)_rotateX(5deg)_scale(1.05)]")} style={{ perspective: '1000px' }}>
        <Card className="overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl">
          <Link href={`/novels/${novel.id}`} onClick={startLoading}>
              <CardContent className="p-0">
                <div className="aspect-[2/3] relative">
                  <Image
                    src={novel.coverImageUrl}
                    alt={`Cover of ${novel.title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  />
                   <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {novel.status && (
                      <Badge className="bg-primary/80 backdrop-blur-sm border-none text-xs capitalize">
                        {novel.status}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    {novel.ageRating && (
                      <div className="flex justify-end">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-white text-xs font-bold uppercase tracking-wider",
                          getAgeRatingColor(novel.ageRating)
                        )}>
                          {novel.ageRating}
                        </span>
                      </div>
                    )}
                  </div>
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
          <Button asChild size="sm" className="w-full mt-2">
            <Link href={`/novels/${novel.id}/${novelProgress?.chapterId ?? startChapter}`} onClick={startLoading}>
              <BookOpen className="mr-2 h-4 w-4" />
              {novelProgress ? 'Continue Reading' : 'Start Reading'}
            </Link>
          </Button>
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
