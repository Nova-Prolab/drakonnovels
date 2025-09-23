import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { ChapterList } from '../_components/chapter-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { getNovelDetails } from '@/lib/github-service';

type ChaptersPageProps = {
    params: {
      novelId: string;
    };
};

export async function generateMetadata({ params }: ChaptersPageProps): Promise<Metadata> {
    const novel = await getNovelDetails(params.novelId);
  
    if (!novel) {
      return {
        title: 'Novel Not Found',
      };
    }
  
    return {
      title: `Chapters for ${novel.title} | DrakonInk`,
      description: `Browse all chapters for the novel ${novel.title}.`,
    };
}
  

export default async function ChaptersPage({ params }: ChaptersPageProps) {
    const novel = await getNovelDetails(params.novelId);

    if (!novel) {
        notFound();
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Button asChild variant="ghost">
                            <Link href={`/novels/${novel.id}`} className="inline-flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to Novel Details</span>
                            </Link>
                        </Button>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">{novel.title}</h1>
                        <p className="mt-2 text-lg text-muted-foreground">All Chapters</p>
                    </div>

                    <ChapterList novel={novel} showAllChaptersLink={false}/>
                </div>
            </main>
        </div>
    );
}
