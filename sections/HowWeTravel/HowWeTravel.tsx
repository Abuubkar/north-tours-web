import { PrincipleCell } from '@/components/about/PrincipleCell/PrincipleCell';
import { headlineSize } from '@/lib/utils/headline';
import type { HowWeTravelProps } from './HowWeTravel.types';
import styles from './HowWeTravel.module.css';

const headlineClass = { standard: styles.headline, long: styles.longHeadline };

/**
 * "How we run every trip": the principles as an unordered list in a text grid that lines up with
 * the page margins. They aren't a sequence, so they carry no numbers.
 */
export function HowWeTravel({ copy }: HowWeTravelProps) {
  return (
    <section className={styles.section}>
      <h2 className={headlineClass[headlineSize(copy.headline)]}>{copy.headline}</h2>
      <ul className={styles.grid}>
        {copy.items.map((item) => (
          <PrincipleCell key={item.title} title={item.title} text={item.text} />
        ))}
      </ul>
    </section>
  );
}
