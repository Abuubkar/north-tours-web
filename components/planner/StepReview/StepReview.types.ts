import type { PlannerCopy } from '@/lib/content/pages';

export type StepReviewProps = {
  copy: PlannerCopy['review'];
  steps: PlannerCopy['steps'];
  backLabel: string;
};
