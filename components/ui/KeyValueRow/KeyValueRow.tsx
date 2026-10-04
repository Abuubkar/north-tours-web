import type { KeyValueRowProps } from './KeyValueRow.types';
import styles from './KeyValueRow.module.css';

/**
 * One label and value pair, divided by hairlines. Place rows inside a <dl>; the first row
 * draws the list's top hairline. With a note it's a room-price row: "Twin sharing / Base price"
 * beside the price. In the column layout the label sits in a fixed column with the value beside it.
 */
export function KeyValueRow({ label, note, layout = 'pair', children }: KeyValueRowProps) {
  if (layout === 'column') {
    return (
      <div className={`${styles.row} ${styles.columnRow}`}>
        <dt className={styles.columnLabel}>{label}</dt>
        <dd className={styles.columnValue}>{children}</dd>
      </div>
    );
  }

  if (note === undefined) {
    return (
      <div className={styles.row}>
        <dt className={styles.label}>{label}</dt>
        <dd className={styles.value}>{children}</dd>
      </div>
    );
  }

  return (
    <div className={`${styles.row} ${styles.noted}`}>
      <dt className={styles.notedLabel}>
        {label}
        <span className={styles.note}>{note}</span>
      </dt>
      <dd className={styles.notedValue}>{children}</dd>
    </div>
  );
}
