import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import { novels } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReadingProgressButton } from './_components/reading-progress-button';
import { BookOpen } from 'lucide-react';

type NovelDetailsPageProps = {
  params: {
    novelId: string;
  };
};

export async function generateMetadata({ params }: NovelDetailsPageProps): Promise<Metadata> {
  const novel = novels.find(n => n.id === params.novelId);

  if (!novel) {
    return {
      title: 'Novel Not Found',
    };
  }

  return {
    title: `${novel.title} | Story Weaver`,
    description: novel.description,
  };
}

export default function NovelDetailsPage({ params }: NovelDetailsPageProps) {
  const novel = novels.find(n => n.id === params.novelId);

  if (!novel) {
    notFound();
  }

  const coverImage = PlaceHolderImages.find(img => img.id === novel.coverImageId);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
                {coverImage ? (
                  <Image
                    src={coverImage.imageUrl}
                    alt={`Cover of ${novel.title}`}
                    fill
                    className="object-cover"
                    data-ai-hint={coverImage.imageHint}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>
              <div className="mt-6 flex flex-col gap-3">
                 <ReadingProgressButton novelId={novel.id} />
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-primary">{novel.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-1">{novel.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">by {novel.author}</p>
            
            <div className="mt-6 prose prose-lg dark:prose-invert max-w-none">
                <p>{novel.description}</p>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {novel.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Chapters</h3>
              <ul className="space-y-2">
                {novel.chapters.map(chapter => (
                  <li key={chapter.id}>
                    <Link href={`/novels/${novel.id}/${chapter.id}`} className="block p-3 rounded-lg hover:bg-accent transition-colors">
                      <p className="font-medium">Chapter {chapter.id}: {chapter.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
