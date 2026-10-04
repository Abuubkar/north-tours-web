import type { FactCellProps } from './FactCell.types';
import styles from './FactCell.module.css';

const valueClass = { hero: styles.heroValue, strip: styles.stripValue };

/** One fact: a small label over its value. Sits in a <dl> (`FactsRow`, the quick facts strip). */
export function FactCell({ label, children, size = 'hero', className }: FactCellProps) {
  return (
    <div className={[styles.cell, className].filter(Boolean).join(' ')}>
      <dt className={styles.label}>{label}</dt>
      <dd className={valueClass[size]}>{children}</dd>
    </div>
  );
}
