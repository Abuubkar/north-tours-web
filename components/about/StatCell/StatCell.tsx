import type { StatCellProps } from './StatCell.types';
import styles from './StatCell.module.css';

/** One figure about the company, large and light ("12"), over what it counts ("years running trips"). */
export function StatCell({ value, label }: StatCellProps) {
  return (
    <li className={styles.cell}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </li>
  );
}
