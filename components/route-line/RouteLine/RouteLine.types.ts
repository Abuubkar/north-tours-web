import type { Destination } from '@/lib/content/destinations';
import type { DestinationCopy } from '@/lib/content/pages';

export type RouteLineProps = {
  /** The road's stops in order, Lahore first and the destination last; each but the last with its drive to the next. */
  stops: Destination['gettingThere']['stops'];
  copy: Pick<DestinationCopy['gettingThere'], 'arrive' | 'leg'>;
};
