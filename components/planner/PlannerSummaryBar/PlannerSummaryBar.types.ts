import type { ReactNode, Ref } from 'react';
import type { PlannerCopy } from '@/lib/content/pages';

export type PlannerSummaryBarProps = {
  /** The one-line trip: "Hunza · Jun · 4 people". */
  label: string;
  copy: Pick<PlannerCopy['aside'], 'rows' | 'notAnswered'>;
  /** The progress, under the summary. */
  children?: ReactNode;
  /** The bar, which fields scroll to just below. */
  ref?: Ref<HTMLDivElement>;
  /** Its place in the page (the planner shows it above its header). */
  className?: string;
};
