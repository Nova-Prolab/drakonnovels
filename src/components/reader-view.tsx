import type { Novel, Chapter } from '@/lib/types';
import { ClientReaderView } from './client-reader-view';

type ReaderViewProps = {
  novel: Novel;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
};

// This component remains a Server Component (or can be used in one).
// It fetches no data but acts as a bridge, passing server-side props
// to the Client Component that will handle all interactivity.
export function ReaderView({ novel, chapter, prevChapter, nextChapter }: ReaderViewProps) {
  return (
    <ClientReaderView 
      novel={novel} 
      chapter={chapter}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
    />
  );
}
