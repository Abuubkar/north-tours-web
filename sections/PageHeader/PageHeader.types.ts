import type { ReactNode } from 'react';
import type { LastUpdatedProps } from '@/components/ui/LastUpdated/LastUpdated.types';
import type { Photo } from '@/lib/content/images';

/** A text-only header: no photo. */
type WithoutPhoto = {
  /**
   * default: the <h1> at the statement size over the lead (Tours). planner: the same on the light
   * page with a shorter lead and less room below (Trip Planner, step 1). plannerSlim: the planner's
   * later steps, where the same <h1> reads as a slim line ("Planning your private trip").
   */
  variant?: 'default' | 'planner' | 'plannerSlim';
  image?: never;
  updated?: never;
  search?: never;
  label?: never;
};

/** About: the <h1> at the long size, the lead, then a wide photo (the page's LCP image). */
type About = {
  variant: 'about';
  /** 4:3 on phones, 21:9 from 820px, cropped at its focus. */
  image: Photo;
  updated?: never;
  search?: never;
  label?: never;
};

/** Help (light): the <h1> at the statement size, then the search. */
type Help = {
  variant: 'help';
  /** The search field (Help's client `HelpSearch`). */
  search: ReactNode;
  image?: never;
  updated?: never;
  label?: never;
};

/** The legal pages (light): the document's title as the <h1>, then when it was last updated. */
type Legal = {
  variant: 'legal';
  /** "Last updated {date}" and the date, YYYY-MM-DD. */
  updated: Omit<LastUpdatedProps, 'className'>;
  image?: never;
  search?: never;
  label?: never;
};

/**
 * Contact (dark): the "Contact" label in the 240px label column beside the <h1>, then the lead.
 * An owner-approved exception to DESIGN.md §6, which keeps labels for sections without a headline.
 */
type Contact = {
  variant: 'contact';
  /** "Contact": plain text, not a heading. */
  label: string;
  image?: never;
  updated?: never;
  search?: never;
};

export type PageHeaderProps = (WithoutPhoto | About | Help | Legal | Contact) & {
  /** The page's <h1>. */
  headline: string;
  /** The line under it; the slim planner header has none. */
  lead?: string;
};

export type PageHeaderVariant = NonNullable<PageHeaderProps['variant']>;
