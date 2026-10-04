'use client';

import { usePlanner } from '@/hooks/usePlanner';
import { answeredCount } from '@/lib/utils/plannerBar';
import { fillTokens } from '@/lib/utils/tokens';
import { TripSummaryRows } from '../TripSummaryRows/TripSummaryRows';
import { WhatHappensNext } from '../WhatHappensNext/WhatHappensNext';
import type { PlannerAsideProps } from './PlannerAside.types';
import styles from './PlannerAside.module.css';

/**
 * From 1100px, beside the form: "Your trip so far" (how many of the nine rows are answered, and
 * the rows) and "What happens next". Sticky under the header, scrolling inside when taller than
 * the screen.
 */
export function PlannerAside({ copy, next }: PlannerAsideProps) {
  const { trip } = usePlanner();
  return (
    <aside aria-label={copy.label} className={styles.aside}>
      <section className={styles.panel}>
        <div className={styles.head}>
          <h2 className={styles.title}>{copy.label}</h2>
          <span className={styles.count}>{fillTokens(copy.answered, { count: String(answeredCount(trip)) })}</span>
        </div>
        <TripSummaryRows copy={copy} />
      </section>
      <WhatHappensNext copy={next} />
    </aside>
  );
}
