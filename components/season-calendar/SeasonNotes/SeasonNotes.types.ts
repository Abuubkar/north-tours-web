import type { Destination } from '@/lib/content/destinations';
import type { DestinationCopy } from '@/lib/content/pages';

export type SeasonNotesProps = {
  /** The destination's four notes, spring to winter. */
  seasons: Destination['seasons'];
  /** Each season's name and months. */
  copy: DestinationCopy['calendar']['seasons'];
};
