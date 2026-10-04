import { Accordion } from '@/components/ui/Accordion/Accordion';
import { RefundTable } from '../RefundTable/RefundTable';
import type { PolicyCardProps } from './PolicyCard.types';
import styles from './PolicyCard.module.css';

/**
 * One booking policy in plain words: its title, a short summary, the refund table where it
 * applies, then "Read the full policy", which opens the full text and reads "Hide the full
 * policy" while open (no JavaScript needed).
 */
export function PolicyCard({ id, title, summary, refundRows, paragraphs, table, readMore, hide }: PolicyCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{summary}</p>
      {refundRows && <RefundTable words={table} rows={refundRows} />}
      <Accordion
        size="link"
        marker="caret"
        items={[
          {
            id,
            summary: readMore,
            openSummary: hide,
            content: paragraphs.map((paragraph, i) => (
              <p key={i} className={styles.text}>
                {paragraph}
              </p>
            )),
          },
        ]}
      />
    </article>
  );
}
