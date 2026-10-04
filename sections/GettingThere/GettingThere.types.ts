import type { Destination } from '@/lib/content/destinations';
import type { DestinationCopy } from '@/lib/content/pages';

export type GettingThereProps = {
  gettingThere: Destination['gettingThere'];
  copy: DestinationCopy['gettingThere'];
};
