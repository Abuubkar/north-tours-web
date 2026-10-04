import type { ReactNode } from 'react';
import type { ContentImage } from '@/lib/content/images';

export type PhotoHeroProps = {
  /** The page's main photo (its LCP image). */
  image: ContentImage;
  /** The back link at the top, e.g. "← All tours". */
  back: { href: string; label: string };
  /** The line above the title, e.g. the route "Lahore → Hunza → Skardu". */
  kicker: string;
  /** The page's <h1>. */
  title: string;
  /** The facts under the title (`FactsRow`). */
  children: ReactNode;
};
