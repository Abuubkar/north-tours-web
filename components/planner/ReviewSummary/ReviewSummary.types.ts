import type { PlannerCopy } from '@/lib/content/pages';
import type { QuestionStep } from '@/hooks/usePlanner';

export type ReviewSummaryProps = {
  copy: PlannerCopy['review'];
  /** The three steps' titles, as the sections' headings. */
  steps: PlannerCopy['steps'];
};

/** One section of the review: its step, heading and the rows it shows. */
export type ReviewSection = { step: QuestionStep; title: string; rows: { label: string; value: string | null }[] };
