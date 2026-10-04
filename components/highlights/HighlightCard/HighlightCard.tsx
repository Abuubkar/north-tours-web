import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import type { HighlightCardProps } from './HighlightCard.types';
import styles from './HighlightCard.module.css';

/** The photo's width: up to three columns in the main column, two on phones. */
const PHOTO_SIZES = '(width >= 1100px) 22vw, (width >= 560px) 33vw, 50vw';

/** One place you'll see: its photo, its name as a heading and one line. */
export function HighlightCard({ highlight }: HighlightCardProps) {
  return (
    <div className={styles.card}>
      <MediaFrame image={highlight.image} ratio="4:3" sizes={PHOTO_SIZES} className={styles.photo} />
      <div className={styles.text}>
        <h3 className={styles.title}>{highlight.title}</h3>
        <p className={styles.line}>{highlight.text}</p>
      </div>
    </div>
  );
}
