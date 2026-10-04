import { CheckboxIndicator } from '@/components/ui/CheckboxIndicator/CheckboxIndicator';
import type { CheckListProps } from './CheckList.types';
import styles from './CheckList.module.css';

/**
 * "How we keep you safe": a list of practices divided by hairlines, each with the checkbox
 * indicator's ✓ square, which is decorative (hidden from screen readers).
 */
export function CheckList({ title, items }: CheckListProps) {
  return (
    <div>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item} className={styles.row}>
            <CheckboxIndicator checked />
            <span className={styles.text}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
