import type { GoodToKnowProps } from './GoodToKnow.types';
import styles from './GoodToKnow.module.css';

/** "Good to know before you go", on the light reading surface: each practical note's title as an <h3>, then its text. */
export function GoodToKnow({ copy, notes }: GoodToKnowProps) {
  return (
    <section className={styles.section} data-surface="light">
      <h2 className={styles.headline}>{copy.headline}</h2>
      <ul className={styles.notes}>
        {notes.map((note) => (
          <li key={note.title} className={styles.note}>
            <h3 className={styles.title}>{note.title}</h3>
            <p className={styles.text}>{note.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
