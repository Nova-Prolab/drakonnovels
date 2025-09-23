"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Novel } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLibrary } from '@/lib/hooks';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Fuse from 'fuse.js';
import { Button } from './ui/button';
import { NovelList } from './novel-list';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

type ExploreViewProps = {
  novels: Novel[];
  initialSearchTerm?: string;
};

const fuseOptions = {
  keys: ['title', 'author', 'tags', 'category'],
  includeScore: true,
  threshold: 0.4,
};

const getUniqueValues = (novels: Novel[], key: keyof Novel) => {
    const values = novels.flatMap(novel => novel[key]).filter(Boolean);
    return [...new Set(values as string[])].sort();
}

export function ExploreView({ novels, initialSearchTerm = '' }: ExploreViewProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [activeTab, setActiveTab] = useState(initialSearchTerm ? 'all' : 'explore');
  const { library, isReady } = useLibrary();
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [ageRatingFilter, setAgeRatingFilter] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const categories = useMemo(() => getUniqueValues(novels, 'category'), [novels]);
  const statuses = useMemo(() => getUniqueValues(novels, 'status'), [novels]);
  const ageRatings = useMemo(() => getUniqueValues(novels, 'ageRating'), [novels]);
  const allTags = useMemo(() => getUniqueValues(novels, 'tags'), [novels]);

  const fuse = useMemo(() => new Fuse(novels, fuseOptions), [novels]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (typeof query === 'string') {
      setSearchTerm(query);
      setActiveTab('all');
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    
    const params = new URLSearchParams(searchParams);
    if (newSearchTerm) {
      params.set('q', newSearchTerm);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  const resetFilters = () => {
    setCategoryFilter('');
    setStatusFilter('');
    setAgeRatingFilter('');
    setSelectedTags([]);
    clearSearch();
  }

  const filteredNovels = useMemo(() => {
    let novelsToFilter = novels;

    if (activeTab === 'library') {
      return novels.filter(novel => library.includes(novel.id));
    }

    if (searchTerm) {
      novelsToFilter = fuse.search(searchTerm).map(result => result.item);
    }
    
    if (activeTab === 'explore') {
      if (categoryFilter) {
        novelsToFilter = novelsToFilter.filter(n => n.category === categoryFilter);
      }
      if (statusFilter) {
        novelsToFilter = novelsToFilter.filter(n => n.status === statusFilter);
      }
      if (ageRatingFilter) {
        novelsToFilter = novelsToFilter.filter(n => n.ageRating === ageRatingFilter);
      }
      if (selectedTags.length > 0) {
        novelsToFilter = novelsToFilter.filter(n => selectedTags.every(tag => n.tags.includes(tag)));
      }
    }

    return novelsToFilter;
  }, [novels, searchTerm, activeTab, library, fuse, categoryFilter, statusFilter, ageRatingFilter, selectedTags]);

  const isSearching = searchTerm.length > 0;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by title, author, or tag..." 
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
           {isSearching && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={clearSearch}>
              <X className="h-4 w-4"/>
            </Button>
          )}
        </div>
        <TabsList>
          <TabsTrigger value="all">All Novels</TabsTrigger>
          <TabsTrigger value="explore">Explore</TabsTrigger>
          <TabsTrigger value="library" disabled={!isReady}>My Library</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all">
        {isSearching && (
            <div className="flex items-center justify-between border-b pb-4 mb-8">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight">Search Results</h2>
                <p className="text-muted-foreground">Found {filteredNovels.length} results for &quot;{searchTerm}&quot;</p>
            </div>
            </div>
        )}
        <NovelList novels={filteredNovels} searchTerm={searchTerm} />
      </TabsContent>

      <TabsContent value="explore">
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen} className="space-y-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className="ml-2 h-4 w-4 transition-transform data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <Card>
                <CardContent className="p-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Category</label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-1">
                            <label className="text-sm font-medium">Status</label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Statuses</SelectItem>
                                    {statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-1">
                            <label className="text-sm font-medium">Age Rating</label>
                            <Select value={ageRatingFilter} onValueChange={setAgeRatingFilter}>
                                <SelectTrigger><SelectValue placeholder="All Ages" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Ages</SelectItem>
                                    {ageRatings.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                         <div className="flex flex-wrap gap-2">
                            {allTags.map(tag => (
                                <Badge 
                                    key={tag}
                                    variant={selectedTags.includes(tag) ? "default" : "secondary"}
                                    onClick={() => handleTagToggle(tag)}
                                    className="cursor-pointer transition-colors"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                     <div className="flex justify-end">
                        <Button variant="ghost" onClick={resetFilters}>
                            <X className="mr-2 h-4 w-4" />
                            Reset Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
        <div className="mt-8">
            <NovelList novels={filteredNovels} searchTerm={searchTerm} />
        </div>
      </TabsContent>

      <TabsContent value="library">
        <NovelList novels={filteredNovels} />
      </TabsContent>
    </Tabs>
  );
}
