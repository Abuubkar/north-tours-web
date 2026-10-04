import type { SectionLabelProps } from './SectionLabel.types';
import styles from './SectionLabel.module.css';

/** The small triangle and name, only for a section without a headline of its own. */
export function SectionLabel({ children, as: Tag = 'p' }: SectionLabelProps) {
  return (
    <Tag className={styles.sectionLabel}>
      <span className={styles.mark} aria-hidden="true" />
      {children}
    </Tag>
  );
}
