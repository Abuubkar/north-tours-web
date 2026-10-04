import { HighlightGrid } from '@/components/highlights/HighlightGrid/HighlightGrid';
import type { HighlightsProps } from './Highlights.types';
import styles from './Highlights.module.css';

/** "What you'll see along the way": the tour's highlights, each with its photo. */
export function Highlights({ headline, highlights }: HighlightsProps) {
  return (
    <section id="highlights" className={styles.section}>
      <h2 className={styles.headline}>{headline}</h2>
      <div className={styles.grid}>
        <HighlightGrid highlights={highlights} />
      </div>
    </section>
  );
}
