import type { Season } from '../content/fields.ts';
import { LONG_MONTHS, SHORT_MONTHS } from './dates.ts';

/*
 * A destination's month-by-month calendar (PRD #63): each month best, good or avoid, as the
 * design names the three levels, and its check against the destination's best season.
 */

export const MONTH_LEVELS = ['best', 'good', 'avoid'] as const;

export type MonthLevel = (typeof MONTH_LEVELS)[number];

/** The four season notes, in the order a destination lists them. */
export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;

/** One month in the calendar: "Jan" shown, "January" read out, its level and the level's label. */
type CalendarCell = { short: string; full: string; level: MonthLevel; label: string };

/** The twelve stored levels, January first, as the calendar's cells. */
export function calendarCells(levels: readonly MonthLevel[], labels: Record<MonthLevel, string>): CalendarCell[] {
  return levels.map((level, i) => ({ short: SHORT_MONTHS[i], full: LONG_MONTHS[i], level, label: labels[level] }));
}

/** Whether month `i` (0 for January) falls in the season, which may run over the year's end (Nov to Feb). */
function inSeason(i: number, from: number, to: number): boolean {
  return from <= to ? i >= from && i <= to : i >= from || i <= to;
}

/**
 * Where a calendar disagrees with the best season: the season's first and last months must be
 * best, and no month outside it may be. Each problem names its month (0 for January).
 */
export function bestSeasonProblems(levels: readonly MonthLevel[], season: Season): { month: number; message: string }[] {
  const from = SHORT_MONTHS.indexOf(season.from);
  const to = SHORT_MONTHS.indexOf(season.to);
  const range = `${season.from} – ${season.to}`;
  return levels.flatMap((level, i) => {
    if ((i === from || i === to) && level !== 'best') {
      return [{ month: i, message: `${LONG_MONTHS[i]} ${i === from ? 'starts' : 'ends'} the best season (${range}), so it must be best` }];
    }
    if (!inSeason(i, from, to) && level === 'best') {
      return [{ month: i, message: `${LONG_MONTHS[i]} is outside the best season (${range}), so it can’t be best` }];
    }
    return [];
  });
}
