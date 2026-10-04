import type { Destination } from '@/lib/content/destinations';
import type { DestinationCopy } from '@/lib/content/pages';

export type SeasonCalendarSectionProps = {
  destination: Pick<Destination, 'months' | 'seasons'>;
  copy: DestinationCopy['calendar'];
};
