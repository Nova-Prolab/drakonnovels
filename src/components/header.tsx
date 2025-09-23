import Link from 'next/link';
import { SettingsControls } from './settings-controls';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image src="https://i.imgur.com/18GTnzt.png" alt="DrakonInk Logo" width={150} height={40} className="h-10 w-auto" />
        </Link>
        <SettingsControls />
      </div>
    </header>
  );
}
