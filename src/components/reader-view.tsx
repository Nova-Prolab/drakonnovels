import type { Novel, Chapter } from '@/lib/types';
import { ClientReaderView } from './client-reader-view';
import { ThemeProvider } from './theme-provider';
import { Lora, Merriweather, Lato } from 'next/font/google';
import { cn } from '@/lib/utils';

type ReaderViewProps = {
  novel: Novel;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
};

// Se importan las fuentes aquí para que estén disponibles en el lado del servidor
// y se pasen las clases al componente de cliente, evitando el FOUC.
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather'});
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato'});


// Este componente sigue siendo un Componente de Servidor.
// Prepara las props, incluyendo las clases de las fuentes,
// y las pasa al componente de cliente.
export function ReaderView({ novel, chapter, prevChapter, nextChapter }: ReaderViewProps) {
  return (
    <ThemeProvider>
      <div className={cn(lora.variable, merriweather.variable, lato.variable)}>
          <ClientReaderView 
            novel={novel} 
            chapter={chapter}
            prevChapter={prevChapter}
            nextChapter={nextChapter}
          />
      </div>
    </ThemeProvider>
  );
}
