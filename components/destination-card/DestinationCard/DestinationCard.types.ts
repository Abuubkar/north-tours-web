import type { Destination } from '@/lib/content/destinations';

export type DestinationCardProps = {
  destination: Pick<Destination, 'slug' | 'name' | 'bestSeason' | 'image'>;
  /**
   * home (the Homepage): a 3:4 photo, a label over the months in full ("Best season", "April – October").
   * other (a destination's other valleys): a 4:3 photo, its season in short and how many tours visit.
   */
  variant?: 'home' | 'other';
  /** Home: introduces the months, e.g. "Best season". */
  seasonLabel?: string;
  /** Other: the two lines under the name, e.g. "Best · Apr – Oct" and "2 tours". */
  details?: { season: string; tours: string };
};
