"use client";

import { useReadingProgress } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import type { Chapter } from "@/lib/types";

type ReadingProgressButtonProps = {
    novelId: string;
    chapters: Chapter[];
};

export function ReadingProgressButton({ novelId, chapters }: ReadingProgressButtonProps) {
    const { progress, isReady } = useReadingProgress();
    const novelProgress = progress[novelId];
    
    const startChapter = chapters[0]?.id ?? 1;

    const href = `/novels/${novelId}/${novelProgress?.chapterId ?? startChapter}`;
    const text = novelProgress ? 'Continue Reading' : 'Start Reading';

    if (!isReady) {
        return (
             <Button size="lg" className="w-full" disabled>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading...
            </Button>
        )
    }

    return (
        <Button asChild size="lg" className="w-full">
            <Link href={href}>
                <BookOpen className="mr-2 h-5 w-5" />
                {text}
            </Link>
        </Button>
    );
}
