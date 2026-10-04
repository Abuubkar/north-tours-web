import { sequenceNumber } from '@/lib/utils/sequence';
import { fillTokens } from '@/lib/utils/tokens';
import type { ItineraryDayProps } from './ItineraryDay.types';
import styles from './ItineraryDay.module.css';

/**
 * One day on the timeline: its node, "Day 03", the title, what happens, and where you sleep, eat
 * and how long you drive. The day being read is marked aria-current="step".
 */
export function ItineraryDay({ day, number, state, copy, miniMap }: ItineraryDayProps) {
  const facts = [
    { label: copy.overnight, value: day.overnight },
    { label: copy.meals, value: day.meals },
    { label: copy.drive, value: day.drive },
  ];
  return (
    <li id={`day-${number}`} className={styles.day} aria-current={state === 'current' ? 'step' : undefined}>
      <span className={`${styles.node} ${styles[state]}`} aria-hidden="true" />
      <div className={styles.head}>
        <div className={styles.mini}>{miniMap}</div>
        <div>
          <p className={styles.label}>{fillTokens(copy.dayLabel, { number: sequenceNumber(number) })}</p>
          <h3 className={styles.title}>{day.title}</h3>
        </div>
      </div>
      <p className={styles.text}>{day.text}</p>
      <dl className={styles.facts}>
        {facts.map(({ label, value }) => (
          <div key={label}>
            <dt className={styles.factLabel}>{label}</dt>
            <dd className={styles.factValue}>{value}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}
