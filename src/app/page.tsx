import { NovelList } from '@/components/novel-list';
import { Header } from '@/components/header';
import { getNovelList } from '@/lib/github-service';
import { ExploreView } from '@/components/explore-view';

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const novels = await getNovelList();
  const initialSearchTerm = typeof searchParams?.q === 'string' ? searchParams.q : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <ExploreView novels={novels} initialSearchTerm={initialSearchTerm} />
      </main>
    </div>
  );
}
