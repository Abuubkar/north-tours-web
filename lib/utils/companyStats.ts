import type { AboutCopy } from '../content/pages.ts';
import type { Settings } from '../content/settings.ts';
import { yearsSince } from './dates.ts';

/** One figure in "The company in numbers": "12" over "years running trips". */
export type CompanyStat = { value: string; label: string };

/**
 * About's four figures, so they agree with the rest of the site: years running trips and trips
 * completed from the `trust` settings (as the trust strip shows them), travellers from page copy,
 * and guides and drivers counted from the guides in content.
 */
export function companyStats({
  trust,
  travellers,
  guideCount,
  year,
  labels,
}: {
  trust: Pick<Settings['trust'], 'operatingSince' | 'tripsCompleted'>;
  /** As page copy writes it, e.g. "9,000+". */
  travellers: string;
  guideCount: number;
  /** The year the page is built: years count up to it. */
  year: number;
  labels: AboutCopy['numbers']['labels'];
}): CompanyStat[] {
  return [
    { value: String(yearsSince(trust.operatingSince, year)), label: labels.years },
    { value: trust.tripsCompleted, label: labels.trips },
    { value: travellers, label: labels.travellers },
    { value: String(guideCount), label: labels.guides },
  ];
}
