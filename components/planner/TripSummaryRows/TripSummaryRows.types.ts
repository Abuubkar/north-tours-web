import type { PlannerCopy } from '@/lib/content/pages';

export type TripSummaryRowsProps = {
  copy: Pick<PlannerCopy['aside'], 'rows' | 'notAnswered'>;
};
