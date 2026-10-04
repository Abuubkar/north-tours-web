import type { SectionLabelProps } from './SectionLabel.types';
import styles from './SectionLabel.module.css';

/** A section's name as small text, only for a section without a headline of its own. */
export function SectionLabel({ children, as: Tag = 'p' }: SectionLabelProps) {
  return <Tag className={styles.sectionLabel}>{children}</Tag>;
}
