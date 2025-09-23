"use client";

import { useReadingProgress } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { novels } from "@/lib/data";
import { BookOpen } from "lucide-react";

type ReadingProgressButtonProps = {
    novelId: string;
};

export function ReadingProgressButton({ novelId }: ReadingProgressButtonProps) {
    const { progress } = useReadingProgress();
    const novelProgress = progress[novelId];
    const novel = novels.find(n => n.id === novelId);
    const startChapter = novel?.chapters[0]?.id ?? 1;

    const href = `/novels/${novelId}/${novelProgress?.chapterId ?? startChapter}`;
    const text = novelProgress ? 'Continue Reading' : 'Start Reading';

    return (
        <Button asChild size="lg" className="w-full">
            <Link href={href}>
                <BookOpen className="mr-2 h-5 w-5" />
                {text}
            </Link>
        </Button>
    );
}
