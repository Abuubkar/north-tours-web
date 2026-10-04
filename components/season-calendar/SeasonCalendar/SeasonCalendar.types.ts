import type { DestinationCopy } from '@/lib/content/pages';
import type { MonthLevel } from '@/lib/utils/seasonCalendar';

export type SeasonCalendarProps = {
  /** January to December, each best, good or avoid. */
  months: readonly MonthLevel[];
  copy: Pick<DestinationCopy['calendar'], 'legend' | 'levels'>;
};
