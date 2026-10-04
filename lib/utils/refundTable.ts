import type { Settings } from '../content/settings.ts';
import { fillTokens } from './tokens.ts';

type Policies = Settings['policies'];

/** The refund table's words: "{days} or more days", "{from}–{to} days", "Under {days} days", "{percent}%" and "None". */
export type RefundTableWords = { from: string; range: string; under: string; percent: string; none: string };

/** A row of the refund table: the days before departure and the share of the advance refunded. */
export type RefundTableRow = { days: string; refund: string };

/**
 * The refund table, a row per schedule row: "14 or more days" 100%, "7–13 days" 50%, "Under 7
 * days" None. Each row runs from its own days up to the row above; the last starts at 0 days.
 */
export function refundTableRows(policies: Pick<Policies, 'refundSchedule'>, words: RefundTableWords): RefundTableRow[] {
  const rows = policies.refundSchedule;
  return rows.map((row, i) => {
    const refund = row.refundPercent === 0 ? words.none : fillTokens(words.percent, { percent: String(row.refundPercent) });
    if (i === 0) return { days: fillTokens(words.from, { days: String(row.daysBefore) }), refund };
    const above = rows[i - 1].daysBefore;
    if (row.daysBefore === 0) return { days: fillTokens(words.under, { days: String(above) }), refund };
    return { days: fillTokens(words.range, { from: String(row.daysBefore), to: String(above - 1) }), refund };
  });
}
