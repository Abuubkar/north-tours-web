import { StatCell } from '@/components/about/StatCell/StatCell';
import type { InNumbersProps } from './InNumbers.types';
import styles from './InNumbers.module.css';

/**
 * The company in numbers, as the trust strip is laid out: a hairline above and no padding of its
 * own, the figures in a text grid lined up with the margins. Its <h2> is only read out, so
 * heading navigation reaches it.
 */
export function InNumbers({ headline, stats }: InNumbersProps) {
  return (
    <section className={styles.strip}>
      <h2 className={styles.headline}>{headline}</h2>
      <ul className={styles.grid}>
        {stats.map((stat) => (
          <StatCell key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </ul>
    </section>
  );
}
