"use client";

import { useReadingProgress } from "@/lib/hooks";
import type { Novel } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type ChapterListProps = {
    novel: Novel;
};

export function ChapterList({ novel }: ChapterListProps) {
    const { progress, isReady } = useReadingProgress();
    const novelProgress = progress[novel.id];

    const lastReadChapterId = novelProgress?.chapterId ?? 0;
    
    const readChaptersCount = novel.chapters.filter(c => c.id <= lastReadChapterId).length;
    const totalChapters = novel.chapters.length;
    const progressPercentage = totalChapters > 0 ? (readChaptersCount / totalChapters) * 100 : 0;

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">Chapters</h3>
                {isReady && <span className="text-sm text-muted-foreground">{readChaptersCount} / {totalChapters} Read</span>}
            </div>
            
            {isReady && <Progress value={progressPercentage} className="mb-4 h-2" />}

            <div className="border rounded-lg overflow-hidden">
                <ul className="divide-y">
                    {novel.chapters.map(chapter => {
                        const isRead = isReady && chapter.id <= lastReadChapterId;
                        return (
                            <li key={chapter.id}>
                                <Link href={`/novels/${novel.id}/${chapter.id}`} className="block p-4 hover:bg-accent transition-colors">
                                    <div className="flex items-center gap-4">
                                        {isReady ? (
                                             <div className="flex items-center justify-center h-6 w-6">
                                                {isRead ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-muted-foreground/50" />
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-6 w-6"></div>
                                        )}
                                        <div>
                                            <p className={cn("font-medium", isRead ? "text-muted-foreground" : "text-foreground")}>
                                                Chapter {chapter.id}: {chapter.title}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
