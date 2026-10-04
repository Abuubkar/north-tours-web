import type { ReactNode } from 'react';
import type { ContentImage } from '@/lib/content/images';

export type PhotoHeroProps = {
  /**
   * tour (Tour Detail): the title at the tour hero size, wrapping as it needs.
   * destination: the name at display size on one line, sized from its length.
   */
  variant?: 'tour' | 'destination';
  /** The page's main photo (its LCP image). */
  image: ContentImage;
  /** The back link at the top, e.g. "← All tours". */
  back: { href: string; label: string };
  /** The line above the title: the route (`RouteText`), or the region "Gilgit-Baltistan". */
  kicker: ReactNode;
  /** The page's <h1>. */
  title: string;
  /** A line under the title (Destination: its lead). */
  lead?: string;
  /** The facts under the title (`FactsRow`). */
  children: ReactNode;
};
