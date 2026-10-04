import type { Destination } from '@/lib/content/destinations';

export type DestinationOverviewProps = {
  /** The destination's own headline and paragraphs. */
  overview: Destination['overview'];
};
