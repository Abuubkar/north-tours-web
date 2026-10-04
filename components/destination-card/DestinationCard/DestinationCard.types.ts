import type { Destination } from '@/lib/content/destinations';

export type DestinationCardProps = {
  destination: Pick<Destination, 'slug' | 'name' | 'bestSeason' | 'image'>;
  /**
   * home (the Homepage): a 3:4 photo, the label over the months in full ("Best season", "April – October").
   * other (a destination's other valleys): a 4:3 photo, "Best · Apr – Oct" and how many tours visit.
   */
  variant?: 'home' | 'other';
  /** Introduces the months: "Best season" (home), or "Best · {season}" with the short months filled in (other). */
  seasonLabel: string;
  /** Other: how many tours visit, e.g. "2 tours". */
  tours?: string;
};
