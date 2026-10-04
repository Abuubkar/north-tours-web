import { CheckboxIndicator } from '@/components/ui/CheckboxIndicator/CheckboxIndicator';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import type { DestinationChoiceCardProps } from './DestinationChoiceCard.types';
import styles from './DestinationChoiceCard.module.css';

/** Each photo's width: cards at least 150px wide, two across on phones, up to five beside the planner's side column. */
const PHOTO_SIZES = '(width >= 1100px) 200px, (width >= 820px) 25vw, 50vw';

/**
 * A destination to tick in the planner: a toggle button (`aria-pressed`) named by the
 * destination, with its photo, a checkbox and the name. Several can be on (an 8px option tile,
 * with the shared selected state when on).
 */
export function DestinationChoiceCard({ label, image, pressed, invalid = false, describedBy, id, onToggle }: DestinationChoiceCardProps) {
  const classes = [styles.card, invalid && styles.invalid].filter(Boolean).join(' ');
  return (
    <button id={id} type="button" aria-pressed={pressed} aria-label={label} aria-describedby={describedBy} className={classes} onClick={onToggle}>
      {image ? <MediaFrame image={image} ratio="16:10" sizes={PHOTO_SIZES} /> : <span className={styles.stripes} />}
      <span className={styles.text}>
        <CheckboxIndicator checked={pressed} />
        <span className={styles.name}>{label}</span>
      </span>
    </button>
  );
}
