import { FactCell } from '@/components/facts/FactCell/FactCell';
import { seasonRange } from '@/lib/utils/dates';
import { groupSize } from '@/lib/utils/departures';
import { fillTokens } from '@/lib/utils/tokens';
import type { QuickFactsProps } from './QuickFacts.types';
import styles from './QuickFacts.module.css';

/**
 * The strip under the tour hero: difficulty, group size, pickup point, best season and
 * transport, so a family can tell at a glance whether the trip suits them.
 */
export function QuickFacts({ copy, tour, pickupPoint }: QuickFactsProps) {
  const group = groupSize(tour.departures);
  const facts = [
    { label: copy.difficulty, value: tour.difficulty },
    // The largest group on any departure; left out when none is left.
    ...(group === undefined ? [] : [{ label: copy.groupSize, value: fillTokens(copy.groupSizeValue, { count: String(group) }) }]),
    { label: copy.departsFrom, value: pickupPoint },
    { label: copy.bestSeason, value: seasonRange(tour.bestSeason) },
    { label: copy.transport, value: tour.transport },
  ];

  return (
    <section className={styles.strip}>
      <dl className={styles.grid}>
        {facts.map(({ label, value }) => (
          <FactCell key={label} label={label} size="strip" className={styles.cell}>
            {value}
          </FactCell>
        ))}
      </dl>
    </section>
  );
}
