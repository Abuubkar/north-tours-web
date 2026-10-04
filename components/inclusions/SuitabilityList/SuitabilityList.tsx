import type { SuitabilityListProps } from './SuitabilityList.types';
import styles from './SuitabilityList.module.css';

/** Who a trip suits (+) and who it may not (–), side by side; each is a heading over a real list. */
export function SuitabilityList({ suited, notSuited }: SuitabilityListProps) {
  const groups = [
    { ...suited, mark: '+' },
    { ...notSuited, mark: '–' },
  ];
  return (
    <div className={styles.grid}>
      {groups.map(({ heading, lines, mark }) => (
        <div key={heading} className={styles.cell}>
          <h3 className={styles.heading}>{heading}</h3>
          <ul className={styles.list}>
            {lines.map((line) => (
              <li key={line} className={styles.row}>
                <span className={styles.mark} aria-hidden="true">
                  {mark}
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
