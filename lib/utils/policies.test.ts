import { describe, expect, it } from 'vitest';
import { fullRefundDays, refundScheduleText } from './policies.ts';

const schedule = (rows: [number, number][]) => ({
  refundSchedule: rows.map(([daysBefore, refundPercent]) => ({ daysBefore, refundPercent })),
});

describe('fullRefundDays', () => {
  it('is where the full refund starts: the first row', () => {
    expect(fullRefundDays(schedule([[14, 100], [7, 50], [0, 0]]))).toBe(14);
  });
});

describe('refundScheduleText', () => {
  it('writes the schedule as sentences', () => {
    expect(refundScheduleText(schedule([[14, 100], [7, 50], [0, 0]]))).toBe(
      'Cancel 14 or more days before departure for a full refund of your advance. Between 7 and 13 days, 50% is refunded. Within 7 days the advance is non-refundable.',
    );
  });

  it('works with just a full refund and nothing after it', () => {
    expect(refundScheduleText(schedule([[30, 100], [0, 0]]))).toBe(
      'Cancel 30 or more days before departure for a full refund of your advance. Within 30 days the advance is non-refundable.',
    );
  });

  it('names a partial refund at the end', () => {
    expect(refundScheduleText(schedule([[14, 100], [0, 25]]))).toBe(
      'Cancel 14 or more days before departure for a full refund of your advance. Within 14 days, 25% is refunded.',
    );
  });
});
