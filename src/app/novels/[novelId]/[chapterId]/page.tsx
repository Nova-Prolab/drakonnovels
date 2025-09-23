import { novels } from '@/lib/data';
import { ReaderView } from '@/components/reader-view';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type ReaderPageProps = {
  params: { 
    novelId: string;
    chapterId: string 
  };
};

export async function generateMetadata({ params }: ReaderPageProps): Promise<Metadata> {
  const novel = novels.find(n => n.id === params.novelId);
  const chapterId = parseInt(params.chapterId, 10);
  const chapter = novel?.chapters.find(c => c.id === chapterId);

  if (!novel || !chapter) {
    return {
      title: 'Not Found',
      description: 'The requested chapter was not found.',
    };
  }

  return {
    title: `${novel.title} - Chapter ${chapter.id} | Story Weaver`,
    description: `Read Chapter ${chapter.id} of ${novel.title}.`,
  };
}

export default function ReaderPage({ params }: ReaderPageProps) {
  const novel = novels.find(n => n.id === params.novelId);
  if (!novel) {
    notFound();
  }

  const chapterId = parseInt(params.chapterId, 10);
  const chapter = novel.chapters.find(c => c.id === chapterId);
  if (!chapter) {
    notFound();
  }

  const chapterIndex = novel.chapters.findIndex(c => c.id === chapterId);
  const prevChapter = chapterIndex > 0 ? novel.chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < novel.chapters.length - 1 ? novel.chapters[chapterIndex + 1] : null;

  const coverImage = PlaceHolderImages.find(img => img.id === novel.coverImageId);

  return (
    <ReaderView 
      novel={novel} 
      chapter={chapter}
      coverImageUrl={coverImage?.imageUrl}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
    />
  );
}
