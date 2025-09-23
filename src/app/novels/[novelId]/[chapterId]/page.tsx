import { ReaderView } from '@/components/reader-view';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getChapterContent, getNovelDetails } from '@/lib/github-service';

type ReaderPageProps = {
  params: { 
    novelId: string;
    chapterId: string 
  };
};

export async function generateMetadata({ params }: ReaderPageProps): Promise<Metadata> {
  const novel = await getNovelDetails(params.novelId);
  const chapterId = parseInt(params.chapterId, 10);
  const chapter = await getChapterContent(params.novelId, chapterId);

  if (!novel || !chapter) {
    return {
      title: 'Not Found',
      description: 'The requested chapter was not found.',
    };
  }

  return {
    title: `${novel.title} - ${chapter.title} | DrakonInk`,
    description: `Read ${chapter.title} of ${novel.title}.`,
  };
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const novelId = params.novelId;
  const chapterId = parseInt(params.chapterId, 10);

  const novel = await getNovelDetails(novelId);
  if (!novel) {
    notFound();
  }

  const chapter = await getChapterContent(novelId, chapterId);
  if (!chapter) {
    notFound();
  }

  const chapterIndex = novel.chapters.findIndex(c => c.id === chapterId);
  if (chapterIndex === -1) {
    notFound();
  }
  
  const prevChapter = chapterIndex > 0 ? novel.chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < novel.chapters.length - 1 ? novel.chapters[chapterIndex + 1] : null;

  return (
    <ReaderView 
      novel={novel} 
      chapter={chapter}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
    />
  );
}
