import { NovelList } from '@/components/novel-list';
import { Header } from '@/components/header';
import { getNovelList } from '@/lib/github-service';

export default async function Page() {
  const novels = await getNovelList();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <NovelList novels={novels} />
      </main>
    </div>
  );
}
