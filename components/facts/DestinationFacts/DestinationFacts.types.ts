import type { Destination } from '@/lib/content/destinations';
import type { DestinationCopy } from '@/lib/content/pages';

export type DestinationFactsProps = {
  destination: Pick<Destination, 'bestSeason' | 'altitude' | 'fromLahore'>;
  /** How many tours visit (lib/utils/destination `toursVisiting`); 0 leaves the fact out. */
  tourCount: number;
  copy: DestinationCopy['facts'];
};
