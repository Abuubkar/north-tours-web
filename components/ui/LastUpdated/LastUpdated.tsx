import { longDate } from '@/lib/utils/dates';
import { splitAtToken } from '@/lib/utils/tokens';
import type { LastUpdatedProps } from './LastUpdated.types';

/** "Last updated 4 October 2026", the date in a <time> (the legal pages and Help's policies). */
export function LastUpdated({ template, date, className }: LastUpdatedProps) {
  const [before, after] = splitAtToken(template, 'date');
  return (
    <p className={className}>
      {before}
      <time dateTime={date}>{longDate(date)}</time>
      {after}
    </p>
  );
}
