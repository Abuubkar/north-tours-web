import type { Destination } from '@/lib/content/destinations';
import type { DestinationCopy } from '@/lib/content/pages';

export type GoodToKnowProps = {
  copy: DestinationCopy['goodToKnow'];
  notes: NonNullable<Destination['notes']>;
};
