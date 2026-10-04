import type { PlannerCopy } from '@/lib/content/pages';

export type ReviewSummaryProps = {
  copy: PlannerCopy['review'];
  /** The three steps' titles, as the sections' headings. */
  steps: PlannerCopy['steps'];
};
