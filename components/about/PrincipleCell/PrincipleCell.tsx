import type { PrincipleCellProps } from './PrincipleCell.types';
import styles from './PrincipleCell.module.css';

/**
 * One way the company runs every trip: a title and a line. Never numbered: the principles aren't
 * a sequence (CLAUDE.md §8, docs/components.md §5 item 36).
 */
export function PrincipleCell({ title, text }: PrincipleCellProps) {
  return (
    <li className={styles.cell}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </li>
  );
}
