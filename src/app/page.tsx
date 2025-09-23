import { NovelList } from '@/components/novel-list';
import { Header } from '@/components/header';
import { getNovelList } from '@/lib/github-service';
import { ExploreView } from '@/components/explore-view';
import { FeaturedCarousel } from '@/components/featured-carousel';
import { AnimatedParticles } from '@/components/animated-particles';

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const novels = await getNovelList();
  const initialSearchTerm = typeof searchParams?.q === 'string' ? searchParams.q : undefined;

  // For demonstration, we'll feature some of the first novels.
  // In a real app, this would be based on popularity or curation.
  const featuredNovels = novels.slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      <AnimatedParticles />
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12 z-10">
        <FeaturedCarousel novels={featuredNovels} />
        <div className="mt-12 md:mt-16">
          <ExploreView novels={novels} initialSearchTerm={initialSearchTerm} />
        </div>
      </main>
    </div>
  );
}
