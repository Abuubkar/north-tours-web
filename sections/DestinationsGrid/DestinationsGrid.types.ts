import type { DestinationCardProps } from '@/components/destination-card/DestinationCard/DestinationCard.types';

export type DestinationsGridProps = {
  copy: { headline: string; seasonLabel: string };
  destinations: DestinationCardProps['destination'][];
};
