import { Header } from '@/components/header';
import { getNovelList } from '@/lib/github-service';
import { ExploreView } from '@/components/explore-view';
import { AnimatedParticles } from '@/components/animated-particles';

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const novels = await getNovelList();
  const initialSearchTerm = typeof searchParams?.q === 'string' ? searchParams.q : undefined;

  return (
      <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
        <AnimatedParticles />
        <Header />
        <main className="container mx-auto flex-1 px-4 py-8 md:py-12 z-10 space-y-12 md:space-y-16">
          <ExploreView novels={novels} initialSearchTerm={initialSearchTerm} />
        </main>
      </div>
  );
}
