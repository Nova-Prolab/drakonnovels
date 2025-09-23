import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Inter, Lora, Merriweather, Lato } from 'next/font/google';
import { LoadingProvider } from '@/components/loading-provider';
import { LoadingOverlay } from '@/components/loading-overlay';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather'});
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-lato'});


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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-sans antialiased", inter.variable, lora.variable, merriweather.variable, lato.variable)}>
        <ThemeProvider>
          <LoadingProvider>
            <LoadingOverlay />
            {children}
            <Toaster />
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
