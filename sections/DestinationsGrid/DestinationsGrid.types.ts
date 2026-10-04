import type { DestinationCardProps } from '@/components/destination-card/DestinationCard/DestinationCard.types';

/** Home (the Homepage and the destinations page): every destination, up to six across, its months in full. */
type Home = {
  variant?: 'home';
  /** The headline, and the label over each card's months ("Best season"). */
  copy: { headline: string; seasonLabel: string };
  destinations: DestinationCardProps['destination'][];
  /**
   * How many cards load their photo straight away. The destinations page: the first row on
   * phones (two), where a photo is the largest thing on screen (LCP). None on the Homepage.
   */
  priorityCards?: number;
};

/** Other (a destination page): the other destinations, up to five across, each with its season in short and its tours. */
type Other = {
  variant: 'other';
  copy: { headline: string };
  destinations: (DestinationCardProps['destination'] & { details: NonNullable<DestinationCardProps['details']> })[];
};

export type DestinationsGridProps = Home | Other;
