import type { ReactNode } from 'react';
import { Geist } from 'next/font/google';
// Global styles first, so component styles come after them and win ties.
import '@/styles/reset.css';
import '@/styles/tokens.css';
import '@/styles/globals.css';
import { SiteFooter } from '@/components/layout/SiteFooter/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink/SkipLink';
import { getSettings } from '@/lib/content/settings';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  const settings = getSettings();
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <SkipLink />
        <SiteHeader settings={settings} />
        {children}
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
