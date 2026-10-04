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
};

/** About: the <h1> at the long size, the lead, then a wide photo (the page's LCP image). */
type About = {
  variant: 'about';
  /** 4:3 on phones, 21:9 from 820px, cropped at its focus. */
  image: Photo;
};

export type PageHeaderProps = (WithoutPhoto | About) & {
  /** The page's <h1>. */
  headline: string;
  /** The line under it; the slim planner header has none. */
  lead?: string;
};

export type PageHeaderVariant = NonNullable<PageHeaderProps['variant']>;
