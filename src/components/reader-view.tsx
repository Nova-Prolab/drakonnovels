import type { Novel, Chapter } from '@/lib/types';
import { ClientReaderView } from './client-reader-view';
import { ThemeProvider } from './theme-provider';

type ReaderViewProps = {
  novel: Novel;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
};

// Este componente sigue siendo un Componente de Servidor.
// Prepara las props y las pasa al componente de cliente.
export function ReaderView({ novel, chapter, prevChapter, nextChapter }: ReaderViewProps) {
  return (
    <ThemeProvider>
      <ClientReaderView 
        novel={novel} 
        chapter={chapter}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
      />
    </ThemeProvider>
  );
}
