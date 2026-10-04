import type { TextButtonProps } from './TextButton.types';
import styles from './TextButton.module.css';

/** An action that reads like a link, underlined, e.g. "Clear all" (docs/components.md §1.2 item 3). */
export function TextButton({ children, onClick }: TextButtonProps) {
  return (
    <button type="button" className={styles.textButton} onClick={onClick}>
      {children}
    </button>
  );
}
