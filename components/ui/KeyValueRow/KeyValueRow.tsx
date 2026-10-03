import type { KeyValueRowProps } from './KeyValueRow.types';
import styles from './KeyValueRow.module.css';

/**
 * One label and value pair, divided by hairlines. Place rows inside a <dl>; the first row
 * draws the list's top hairline.
 */
export function KeyValueRow({ label, children }: KeyValueRowProps) {
  return (
    <div className={styles.row}>
      <dt className={styles.label}>{label}</dt>
      <dd className={styles.value}>{children}</dd>
    </div>
  );
}
