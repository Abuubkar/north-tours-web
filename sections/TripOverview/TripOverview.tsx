import { SuitabilityList } from '@/components/inclusions/SuitabilityList/SuitabilityList';
import type { TripOverviewProps } from './TripOverview.types';
import styles from './TripOverview.module.css';

/** What kind of trip it is (#overview): the tour's own headline and paragraphs, then who it suits and who it may not. */
export function TripOverview({ overview, copy }: TripOverviewProps) {
  return (
    <section id="overview" className={styles.section}>
      <h2 className={styles.headline}>{overview.headline}</h2>
      <div className={styles.body}>
        {overview.paragraphs.map((paragraph) => (
          <p key={paragraph} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
      <div className={styles.suitability}>
        <SuitabilityList
          suited={{ heading: copy.suitedTo, lines: overview.suitedTo }}
          notSuited={{ heading: copy.notSuitedTo, lines: overview.notSuitedTo }}
        />
      </div>
    </section>
  );
}
