import type { Settings } from '../content/settings.ts';
import { yearsSince } from './dates.ts';

/** One figure in "The company in numbers": "12" over "years running trips". */
export type CompanyStat = { value: string; label: string };

type StatLabels = { years: string; trips: string; travellers: string; guides: string };

/**
 * About's four figures, so they agree with the rest of the site: years running trips and trips
 * completed from the `trust` settings (as the trust strip shows them), travellers from page copy,
 * and guides and drivers counted from the guides in content.
 */
export function companyStats(
  trust: Pick<Settings['trust'], 'operatingSince' | 'tripsCompleted'>,
  travellers: string,
  guideCount: number,
  year: number,
  labels: StatLabels,
): CompanyStat[] {
  return [
    { value: String(yearsSince(trust.operatingSince, year)), label: labels.years },
    { value: trust.tripsCompleted, label: labels.trips },
    { value: travellers, label: labels.travellers },
    { value: String(guideCount), label: labels.guides },
  ];
}
