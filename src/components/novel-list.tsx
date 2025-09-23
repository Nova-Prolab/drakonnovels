"use client";

import type { Novel } from '@/lib/types';
import { NovelCard } from './novel-card';
import { Search } from 'lucide-react';

type NovelListProps = {
  novels: Novel[];
  searchTerm?: string;
};

export function NovelList({ novels, searchTerm }: NovelListProps) {
  
  const isSearching = searchTerm && searchTerm.length > 0;

  if (novels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <Search className="w-16 h-16 text-muted-foreground mb-4"/>
        <h3 className="text-xl font-semibold">No Novels Found</h3>
        <p className="text-muted-foreground mt-2">
            {isSearching
                ? `No results found for "${searchTerm}". Try adjusting your filters.`
                : "No novels match the current criteria."
            }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {novels.map((novel) => (
        <NovelCard key={novel.id} novel={novel} />
      ))}
    </div>
  );
}
