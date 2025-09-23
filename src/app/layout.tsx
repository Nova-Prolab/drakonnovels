import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';
import { LoadingProvider } from '@/components/loading-provider';
import { LoadingOverlay } from '@/components/loading-overlay';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'DrakonInk',
  description: 'Tu portal a historias infinitas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <LoadingProvider>
          <LoadingOverlay />
          {children}
          <Toaster />
        </LoadingProvider>
      </body>
    </html>
  );
}
