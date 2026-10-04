import { headlineSize } from '@/lib/utils/headline';
import type { DestinationOverviewProps } from './DestinationOverview.types';
import styles from './DestinationOverview.module.css';

const headlineClass = { standard: styles.headline, long: styles.longHeadline };

/** What the valley is like: the destination's headline, then its paragraphs aligned right. Straight after the hero, so no hairline above. */
export function DestinationOverview({ overview }: DestinationOverviewProps) {
  return (
    <section className={styles.section}>
      <h2 className={headlineClass[headlineSize(overview.headline)]}>{overview.headline}</h2>
      <div className={styles.body}>
        {overview.paragraphs.map((paragraph) => (
          <p key={paragraph} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
