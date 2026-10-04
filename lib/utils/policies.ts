import type { Settings } from '../content/settings.ts';

type Policies = Settings['policies'];

/** Days before departure from which the advance is refunded in full: the schedule's first row. */
export function fullRefundDays(policies: Pick<Policies, 'refundSchedule'>): number {
  return policies.refundSchedule[0].daysBefore;
}
