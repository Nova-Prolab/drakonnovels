"use client";

import { useState, useMemo } from 'react';
import type { Novel } from '@/lib/types';
import { NovelCard } from './novel-card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLibrary } from '@/lib/hooks';
import { Search } from 'lucide-react';

type NovelListProps = {
  novels: Novel[];
};

export function NovelList({ novels }: NovelListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { library, isReady } = useLibrary();

  const filteredNovels = useMemo(() => {
    let novelsToFilter = novels;

    if (activeTab === 'library') {
      novelsToFilter = novels.filter(novel => library.includes(novel.id));
    }

    if (!searchTerm) {
      return novelsToFilter;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    return novelsToFilter.filter(novel => 
      novel.title.toLowerCase().includes(lowercasedTerm) ||
      novel.author.toLowerCase().includes(lowercasedTerm) ||
      novel.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
    );
  }, [novels, searchTerm, activeTab, library]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by title, author, or tag..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Novels</TabsTrigger>
            <TabsTrigger value="library" disabled={!isReady}>My Library</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredNovels.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredNovels.map((novel) => (
            <NovelCard key={novel.id} novel={novel} />
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <Search className="w-16 h-16 text-muted-foreground mb-4"/>
            <h3 className="text-xl font-semibold">No Novels Found</h3>
            <p className="text-muted-foreground mt-2">
                {activeTab === 'library'
                    ? "You haven't added any novels to your library yet."
                    : "Try adjusting your search or filter."}
            </p>
         </div>
      )}
    </div>
  );
}
