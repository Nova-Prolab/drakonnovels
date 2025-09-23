
"use client";

import { useReadingProgress } from "@/lib/hooks";
import type { Novel } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { CheckCircle2, Circle, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type ChapterListProps = {
    novel: Novel;
    showAllChaptersLink?: boolean;
};

const CHAPTERS_TO_SHOW = 5;

export function ChapterList({ novel, showAllChaptersLink = true }: ChapterListProps) {
    const { getChapterProgress, isReady, progress } = useReadingProgress();
    const [showAll, setShowAll] = useState(false);

    const novelProgress = progress[novel.id];
    const lastReadChapterId = novelProgress?.chapterId ?? -1;

    const readChapters = novel.chapters.filter(c => getChapterProgress(novel.id, c.id).isRead);
    const readChaptersCount = readChapters.length;

    const totalChapters = novel.chapters.length;
    const progressPercentage = totalChapters > 0 ? (readChaptersCount / totalChapters) * 100 : 0;

    const chaptersToShow = showAll ? novel.chapters : novel.chapters.slice(0, CHAPTERS_TO_SHOW);
    const canShowMore = novel.chapters.length > CHAPTERS_TO_SHOW;

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">Capítulos</h3>
                {isReady && <span className="text-sm text-muted-foreground">{readChaptersCount} / {totalChapters} Leídos</span>}
            </div>
            
            {isReady && <Progress value={progressPercentage} className="mb-4 h-2" />}

            <div className="border rounded-lg overflow-hidden">
                <ul className="divide-y">
                    {chaptersToShow.map(chapter => {
                        const { isRead } = getChapterProgress(novel.id, chapter.id);
                        const isCurrent = chapter.id === lastReadChapterId;

                        return (
                            <li key={chapter.id}>
                                <Link href={`/novels/${novel.id}/${chapter.id}`} className="block p-4 hover:bg-accent transition-colors">
                                    <div className="flex items-center gap-4">
                                        {isReady ? (
                                             <div className="flex items-center justify-center h-6 w-6">
                                                {isRead ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Circle className={cn("h-5 w-5", isCurrent ? "text-primary" : "text-muted-foreground/50")} />
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-6 w-6"></div>
                                        )}
                                        <div>
                                            <p className={cn("font-medium", isRead ? "text-muted-foreground" : "text-foreground")}>
                                                {chapter.title}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {canShowMore && (
                <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" onClick={() => setShowAll(!showAll)} className="flex-1">
                        {showAll ? 'Mostrar Menos' : `Mostrar los ${totalChapters} Capítulos`}
                    </Button>
                    {showAllChaptersLink && (
                        <Button asChild variant="ghost" size="icon">
                             <Link href={`/novels/${novel.id}/chapters`}>
                                <List className="h-5 w-5" />
                                <span className="sr-only">Ir a la página de capítulos</span>
                            </Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
