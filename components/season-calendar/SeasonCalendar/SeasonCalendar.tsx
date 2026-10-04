import { calendarCells, MONTH_LEVELS } from '@/lib/utils/seasonCalendar';
import type { SeasonCalendarProps } from './SeasonCalendar.types';
import styles from './SeasonCalendar.module.css';

const cellClass = { best: styles.best, good: styles.good, avoid: styles.avoid };
const labelClass = { best: styles.bestLabel, good: styles.goodLabel, avoid: styles.avoidLabel };
const swatchClass = { best: styles.bestSwatch, good: styles.goodSwatch, avoid: styles.avoidSwatch };

/**
 * The legend, then the twelve months as an ordered list in a hairline grid: six columns on
 * phones, twelve from 820px. Each month shows its level in words, never by colour alone, and is
 * read out in full ("January: Avoid").
 */
export function SeasonCalendar({ months, copy }: SeasonCalendarProps) {
  return (
    <div className={styles.calendar}>
      <ul className={styles.legend}>
        {MONTH_LEVELS.map((level) => (
          <li key={level} className={styles.legendItem}>
            <span className={swatchClass[level]} aria-hidden="true" />
            {copy.legend[level]}
          </li>
        ))}
      </ul>
      <ol className={styles.months}>
        {calendarCells(months, copy.levels).map((cell) => (
          <li key={cell.short} className={cellClass[cell.level]}>
            <span className={styles.name}>
              <span aria-hidden="true">{cell.short}</span>
              <span className={styles.fullName}>{cell.full}: </span>
            </span>
            <span className={labelClass[cell.level]}>{cell.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
