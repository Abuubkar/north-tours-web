import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { routes } from '@/lib/routes';
import type { GuideCardProps } from './GuideCard.types';
import styles from './GuideCard.module.css';

/** In a grid of at most four columns, each at least 150px (DESIGN.md §5): two on phones. */
const PHOTO_SIZES = '(width >= 820px) 25vw, 50vw';

/**
 * A guide or driver: portrait (a placeholder until the owner's photo, ADR-0009), name, then
 * role and base. The card is one link to their profile on the About page, named by them.
 */
export function GuideCard({ guide }: GuideCardProps) {
  const id = `guide-card-${guide.slug}`;
  return (
    <a href={routes.guide(guide.slug)} className={styles.card} aria-labelledby={`${id}-name`} aria-describedby={`${id}-role`}>
      <MediaFrame image={guide.portrait} ratio="4:5" sizes={PHOTO_SIZES} />
      <div className={styles.text}>
        <h3 id={`${id}-name`} className={styles.name}>
          {guide.name}
        </h3>
        <span id={`${id}-role`} className={styles.role}>
          {guide.role} · {guide.base}
        </span>
      </div>
    </a>
  );
}
