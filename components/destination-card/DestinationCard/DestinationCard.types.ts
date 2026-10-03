import type { Destination } from '@/lib/content/destinations';

export type DestinationCardProps = {
  destination: Pick<Destination, 'slug' | 'name' | 'bestSeason' | 'image'>;
  /** Introduces the months, e.g. "Best season". */
  seasonLabel: string;
};
