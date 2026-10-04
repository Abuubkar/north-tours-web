import { SeasonCalendar } from '@/components/season-calendar/SeasonCalendar/SeasonCalendar';
import { SeasonNotes } from '@/components/season-calendar/SeasonNotes/SeasonNotes';
import type { SeasonCalendarSectionProps } from './SeasonCalendarSection.types';
import styles from './SeasonCalendarSection.module.css';

/** "The best months to visit": the calendar with its legend, then a note on each season. */
export function SeasonCalendarSection({ destination, copy }: SeasonCalendarSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <div className={styles.calendar}>
        <SeasonCalendar months={destination.months} copy={copy} />
      </div>
      <div className={styles.notes}>
        <SeasonNotes seasons={destination.seasons} copy={copy.seasons} />
      </div>
    </section>
  );
}
