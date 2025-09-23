import Link from 'next/link';
import { SettingsControls } from './settings-controls';
import { BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            Story Weaver
          </h1>
        </Link>
        <SettingsControls />
      </div>
    </header>
  );
}
