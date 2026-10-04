import type { RefundTableProps } from './RefundTable.types';
import styles from './RefundTable.module.css';

/** How much of the advance comes back for each number of days before departure, from settings. */
export function RefundTable({ words, rows }: RefundTableProps) {
  return (
    <table className={styles.table}>
      <caption className={styles.caption}>{words.caption}</caption>
      <thead>
        <tr>
          <th scope="col" className={styles.header}>
            {words.days}
          </th>
          <th scope="col" className={`${styles.header} ${styles.right}`}>
            {words.refund}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ days, refund }) => (
          <tr key={days}>
            <td className={styles.cell}>{days}</td>
            <td className={`${styles.cell} ${styles.refund} ${styles.right}`}>{refund}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
