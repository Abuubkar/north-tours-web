import type { PlannerPage } from '@/lib/content/plannerPage';

export type TripPlannerProps = {
  /** The page's wording, its settings tokens filled. */
  copy: PlannerPage['copy'];
  destinations: PlannerPage['destinations'];
  /** The summary bar's words on phones. */
  barWords: PlannerPage['barWords'];
};
