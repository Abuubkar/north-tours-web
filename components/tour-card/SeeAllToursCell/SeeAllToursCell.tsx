import { useId } from 'react';
import { Icon } from '@/components/ui/Icon/Icon';
import type { SeeAllToursCellProps } from './SeeAllToursCell.types';
import styles from './SeeAllToursCell.module.css';

const ARROW_SIZE = 24;

/**
 * The last cell of a destination's tour cards: the whole cell links to Tours, filtered to the
 * destination, named by its title and described by its note.
 */
export function SeeAllToursCell({ title, note, href }: SeeAllToursCellProps) {
  const id = useId();
  return (
    <a href={href} className={styles.cell} aria-labelledby={`${id}-title`} aria-describedby={`${id}-note`}>
      <span id={`${id}-title`} className={styles.title}>
        {title}
        <Icon name="arrowRight" size={ARROW_SIZE} className={styles.arrow} />
      </span>
      <span id={`${id}-note`} className={styles.note}>
        {note}
      </span>
    </a>
  );
}
