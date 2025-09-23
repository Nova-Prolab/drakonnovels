import { novels } from '@/lib/data';
import { NovelList } from '@/components/novel-list';
import { Header } from '@/components/header';

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 md:py-12">
        <NovelList novels={novels} />
      </main>
    </div>
  );
}
