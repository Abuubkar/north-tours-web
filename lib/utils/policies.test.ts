import { describe, expect, it } from 'vitest';
import { fullRefundDays } from './policies.ts';

describe('fullRefundDays', () => {
  it('is where the full refund starts: the first row', () => {
    const refundSchedule = [
      { daysBefore: 14, refundPercent: 100 },
      { daysBefore: 7, refundPercent: 50 },
      { daysBefore: 0, refundPercent: 0 },
    ];
    expect(fullRefundDays({ refundSchedule })).toBe(14);
  });
});
