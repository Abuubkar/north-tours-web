import type { SeasonNotesProps } from './SeasonNotes.types';
import styles from './SeasonNotes.module.css';

/** A word on each season (blossom, crowds, autumn colour, snow): its name as an <h3>, its months and the note, in a text hairline grid. */
export function SeasonNotes({ seasons, copy }: SeasonNotesProps) {
  return (
    <ul className={styles.notes}>
      {seasons.map(({ season, text }) => (
        <li key={season} className={styles.note}>
          <div className={styles.header}>
            <h3 className={styles.name}>{copy[season].name}</h3>
            <p className={styles.months}>{copy[season].months}</p>
          </div>
          <p className={styles.text}>{text}</p>
        </li>
      ))}
    </ul>
  );
}
