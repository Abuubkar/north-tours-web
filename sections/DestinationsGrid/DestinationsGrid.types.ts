import type { DestinationCardProps } from '@/components/destination-card/DestinationCard/DestinationCard.types';

export type DestinationsGridProps = {
  /**
   * home (the Homepage, #destinations): every destination, up to six across, its months in full.
   * other (a destination page): the other destinations, up to five across, each with its tours.
   */
  variant?: 'home' | 'other';
  /** The headline, and the line introducing each card's months: "Best season" (home), "Best · {season}" (other). */
  copy: { headline: string; seasonLabel: string };
  /** The cards; on a destination page each with its tours, e.g. "2 tours". */
  destinations: (DestinationCardProps['destination'] & { tours?: string })[];
};
