import { describe, expect, it } from 'vitest';
import { refundTableRows } from './refundTable.ts';

const words = { from: '{days} or more days', range: '{from}–{to} days', single: '{days} days', under: 'Under {days} days', percent: '{percent}%', none: 'None' };

const schedule = (rows: [number, number][]) => ({
  refundSchedule: rows.map(([daysBefore, refundPercent]) => ({ daysBefore, refundPercent })),
});

describe('refundTableRows', () => {
  it('builds the settings schedule’s rows: "or more", the range dash, "Under" and "None"', () => {
    expect(refundTableRows(schedule([[14, 100], [7, 50], [0, 0]]), words)).toEqual([
      { days: '14 or more days', refund: '100%' },
      { days: '7–13 days', refund: '50%' },
      { days: 'Under 7 days', refund: 'None' },
    ]);
  });

  it('builds a two-row schedule', () => {
    expect(refundTableRows(schedule([[10, 100], [0, 0]]), words)).toEqual([
      { days: '10 or more days', refund: '100%' },
      { days: 'Under 10 days', refund: 'None' },
    ]);
  });

  it('builds a four-row schedule, ending with a partial refund', () => {
    expect(refundTableRows(schedule([[30, 100], [15, 50], [7, 25], [0, 10]]), words)).toEqual([
      { days: '30 or more days', refund: '100%' },
      { days: '15–29 days', refund: '50%' },
      { days: '7–14 days', refund: '25%' },
      { days: 'Under 7 days', refund: '10%' },
    ]);
  });

  it('names a range of one day by itself, not "7–7 days"', () => {
    expect(refundTableRows(schedule([[8, 100], [7, 50], [0, 0]]), words)).toEqual([
      { days: '8 or more days', refund: '100%' },
      { days: '7 days', refund: '50%' },
      { days: 'Under 7 days', refund: 'None' },
    ]);
  });
});
