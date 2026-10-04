import type { LegalSectionProps } from './LegalSection.types';
import styles from './LegalSection.module.css';

/** "1. Who we are" as an <h2>, then its paragraphs. The section carries the anchor. */
export function LegalSection({ id, number, heading, paragraphs }: LegalSectionProps) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.heading}>
        <span className={styles.number}>{number}.</span> {heading}
      </h2>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={styles.paragraph}>
          {paragraph}
        </p>
      ))}
    </section>
  );
}
