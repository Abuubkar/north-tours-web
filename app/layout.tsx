import type { Metadata } from 'next';
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
import { NOINDEX } from '@/lib/utils/noindex';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

/**
 * Edit mode (ADR-0034): `pnpm content:edit` sets these in development only, and the layout then loads the
 * overlay from the edit server. No build ever has them, so nothing of edit mode reaches a page.
 */
const EDIT_OVERLAY = process.env.NODE_ENV === 'development' && process.env.EDIT_MODE === '1' ? `${process.env.EDIT_SERVER}/overlay.js` : null;

/** A noindex build (the GitHub Pages preview, ADR-0032) asks search engines to leave every page out. */
export const metadata: Metadata = NOINDEX ? { robots: { index: false } } : {};

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
        {EDIT_OVERLAY && <script type="module" async src={EDIT_OVERLAY} />}
      </body>
    </html>
  );
}
