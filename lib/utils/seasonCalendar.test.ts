import { describe, expect, it } from 'vitest';
import { bestSeasonProblems, calendarCells, type MonthLevel } from './seasonCalendar.ts';

const labels = { best: 'Best', good: 'Good', avoid: 'Avoid' };
/** Hunza's calendar: April to October best. */
const hunza: MonthLevel[] = ['avoid', 'avoid', 'good', 'best', 'best', 'best', 'best', 'best', 'best', 'best', 'good', 'avoid'];

describe('calendarCells', () => {
  it('gives twelve cells, January first, with the short and full month, the level and its label', () => {
    const cells = calendarCells(hunza, labels);
    expect(cells).toHaveLength(12);
    expect(cells[0]).toEqual({ short: 'Jan', full: 'January', level: 'avoid', label: 'Avoid' });
    expect(cells[3]).toEqual({ short: 'Apr', full: 'April', level: 'best', label: 'Best' });
    expect(cells[10]).toEqual({ short: 'Nov', full: 'November', level: 'good', label: 'Good' });
    expect(cells.map((c) => c.short)).toEqual(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
  });
});

describe('bestSeasonProblems', () => {
  it('accepts a calendar that agrees with the best season', () => {
    expect(bestSeasonProblems(hunza, { from: 'Apr', to: 'Oct' })).toEqual([]);
  });

  it('allows good months inside the season, as long as its ends are best (Murree)', () => {
    const murree: MonthLevel[] = ['avoid', 'good', 'good', 'good', 'best', 'best', 'good', 'good', 'best', 'best', 'good', 'good'];
    expect(bestSeasonProblems(murree, { from: 'May', to: 'Oct' })).toEqual([]);
  });

  it('rejects a best month outside the season', () => {
    const levels = hunza.with(10, 'best');
    expect(bestSeasonProblems(levels, { from: 'Apr', to: 'Oct' })).toEqual([
      { month: 10, message: 'November is outside the best season (Apr – Oct), so it can’t be best' },
    ]);
  });

  it('rejects a season end that isn’t best', () => {
    expect(bestSeasonProblems(hunza.with(3, 'good'), { from: 'Apr', to: 'Oct' })).toEqual([
      { month: 3, message: 'April starts the best season (Apr – Oct), so it must be best' },
    ]);
    expect(bestSeasonProblems(hunza.with(9, 'avoid'), { from: 'Apr', to: 'Oct' })).toEqual([
      { month: 9, message: 'October ends the best season (Apr – Oct), so it must be best' },
    ]);
  });

  it('follows a season that runs over the year’s end, December to February', () => {
    const winter: MonthLevel[] = ['best', 'best', 'good', 'good', 'avoid', 'avoid', 'avoid', 'avoid', 'avoid', 'good', 'good', 'best'];
    expect(bestSeasonProblems(winter, { from: 'Dec', to: 'Feb' })).toEqual([]);
    expect(bestSeasonProblems(winter.with(5, 'best'), { from: 'Dec', to: 'Feb' })).toEqual([
      { month: 5, message: 'June is outside the best season (Dec – Feb), so it can’t be best' },
    ]);
    expect(bestSeasonProblems(winter.with(11, 'good'), { from: 'Dec', to: 'Feb' })).toEqual([
      { month: 11, message: 'December starts the best season (Dec – Feb), so it must be best' },
    ]);
  });
});
