import { InclusionList } from '@/components/inclusions/InclusionList/InclusionList';
import type { IncludedProps } from './Included.types';
import styles from './Included.module.css';

/** "What the price includes" (light, #included): what's in the price and what isn't. */
export function Included({ copy, included, notIncluded }: IncludedProps) {
  return (
    <section id="included" data-surface="light" className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <div className={styles.list}>
        <InclusionList
          included={{ heading: copy.included, rows: included }}
          notIncluded={{ heading: copy.notIncluded, rows: notIncluded }}
        />
      </div>
    </section>
  );
}
