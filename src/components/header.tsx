import Link from 'next/link';
import { SettingsControls } from './settings-controls';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="relative flex items-center h-full -ml-10 mt-2">
          <Image src="https://i.imgur.com/18GTnzt.png" alt="DrakonInk Logo" width={800} height={213} className="w-auto" style={{ height: '210px' }}/>
        </Link>
        <SettingsControls />
      </div>
    </header>
  );
}
