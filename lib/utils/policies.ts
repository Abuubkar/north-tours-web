import type { Settings } from '../content/settings.ts';

type Policies = Settings['policies'];

/** Days before departure from which the advance is refunded in full: the schedule's first row. */
export function fullRefundDays(policies: Pick<Policies, 'refundSchedule'>): number {
  return policies.refundSchedule[0].daysBefore;
}

/**
 * The refund schedule as sentences, for FAQ answers and Help: "Cancel 14 or more days before
 * departure for a full refund of your advance. Between 7 and 13 days, 50% is refunded. Within 7
 * days the advance is non-refundable." The schema guarantees a full refund first and 0 days last.
 */
export function refundScheduleText(policies: Pick<Policies, 'refundSchedule'>): string {
  const rows = policies.refundSchedule;
  return rows
    .map((row, i) => {
      if (i === 0) return `Cancel ${row.daysBefore} or more days before departure for a full refund of your advance.`;
      const upTo = rows[i - 1].daysBefore - 1;
      if (row.daysBefore === 0) {
        return row.refundPercent === 0
          ? `Within ${upTo + 1} days the advance is non-refundable.`
          : `Within ${upTo + 1} days, ${row.refundPercent}% is refunded.`;
      }
      return `Between ${row.daysBefore} and ${upTo} days, ${row.refundPercent}% is refunded.`;
    })
    .join(' ');
}
