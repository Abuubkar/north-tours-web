import type { PlannerCopy } from '@/lib/content/pages';
import type { PlannerPage } from '@/lib/content/plannerPage';

export type PlannerAsideProps = {
  copy: PlannerCopy['aside'];
  next: PlannerCopy['next'];
  /** The destinations, for the first chosen one's card photo on the postcard. */
  destinations: PlannerPage['destinations'];
  /** "Your trip" and the destinations' names, for the postcard's title. */
  barWords: PlannerPage['barWords'];
};
