
"use client";

import type { Novel } from '@/lib/types';
import { NovelCard } from './novel-card';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

type NovelListProps = {
  novels: Novel[];
  searchTerm?: string;
  canLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
};

export function NovelList({ novels, searchTerm, canLoadMore = false, onLoadMore, isLoadingMore = false }: NovelListProps) {
  
  const isSearching = searchTerm && searchTerm.length > 0;

  if (novels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <Search className="w-16 h-16 text-muted-foreground mb-4"/>
        <h3 className="text-xl font-semibold">No se encontraron novelas</h3>
        <p className="text-muted-foreground mt-2">
            {isSearching
                ? `No se encontraron resultados para "${searchTerm}". Prueba ajustando tus filtros.`
                : "No hay novelas que coincidan con los criterios actuales."
            }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {novels.map((novel) => (
          <NovelCard key={novel.id} novel={novel} />
        ))}
      </div>
      {canLoadMore && onLoadMore && (
        <div className="mt-10 flex justify-center">
          <Button onClick={onLoadMore} disabled={isLoadingMore} variant="outline" className="w-full sm:w-auto">
            {isLoadingMore ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Cargar Más
          </Button>
        </div>
      )}
    </>
  );
}

    
