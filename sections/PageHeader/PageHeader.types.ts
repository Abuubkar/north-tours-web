import type { ReactNode } from 'react';
import type { LastUpdatedProps } from '@/components/ui/LastUpdated/LastUpdated.types';
import type { Photo } from '@/lib/content/images';

/** A text-only header: no photo. */
type WithoutPhoto = {
  /**
   * default: the <h1> at the statement size over the lead (Tours). plannerSlim: the Trip Planner's
   * later steps, where the same <h1> reads as a slim line ("Planning your private trip"). contact:
   * the <h1> and a lead at most 600px wide, with no label (it would repeat the headline).
   */
  variant?: 'default' | 'plannerSlim' | 'contact';
  image?: never;
  updated?: never;
  search?: never;
};

/**
 * The Trip Planner's first step: the <h1> and a shorter lead on a photo band that slides under the
 * site header, its text on the hero scrim (the page's LCP image).
 */
type Planner = {
  variant: 'planner';
  /** Fills the band, cropped at its focus. */
  image: Photo;
  updated?: never;
  search?: never;
};

/**
 * About: a full-bleed photo cover that slides under the site header (owner feedback, 2026-10-05),
 * with the <h1> at the long size and the lead over its lower part, on the hero scrim.
 */
type About = {
  variant: 'about';
  /** Fills the cover, cropped at its focus: the page's LCP image. */
  image: Photo;
  updated?: never;
  search?: never;
};

/** Help (light): the <h1> at the statement size, then the search. */
type Help = {
  variant: 'help';
  /** The search field (Help's client `HelpSearch`). */
  search: ReactNode;
  image?: never;
  updated?: never;
};

/** The legal pages (light): the document's title as the <h1>, then when it was last updated. */
type Legal = {
  variant: 'legal';
  /** "Last updated {date}" and the date, YYYY-MM-DD. */
  updated: Omit<LastUpdatedProps, 'className'>;
  image?: never;
  search?: never;
};

export type PageHeaderProps = (WithoutPhoto | Planner | About | Help | Legal) & {
  /** The page's <h1>. */
  headline: string;
  /** The line under it; the slim planner header has none. */
  lead?: string;
};

export type PageHeaderVariant = NonNullable<PageHeaderProps['variant']>;
