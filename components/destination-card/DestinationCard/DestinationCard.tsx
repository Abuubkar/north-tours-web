import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { routes } from '@/lib/routes';
import { seasonRange } from '@/lib/utils/dates';
import type { DestinationCardProps } from './DestinationCard.types';
import styles from './DestinationCard.module.css';

/**
 * Each photo's width. Home: at most six columns, each at least 160px, two on phones (DESIGN.md §5).
 * Other: at most five from 820px; two below it, where an odd last card takes the whole row.
 */
const PHOTO = {
  home: { ratio: '3:4', sizes: '(width >= 1100px) 16vw, (width >= 600px) 33vw, 50vw' },
  other: { ratio: '4:3', sizes: '(width >= 820px) 25vw, 100vw' },
} as const;

/**
 * A destination with its photo and best season. The whole card is one link to the destination's
 * page, named by the destination; the season (and, on a destination page, its tours) describes it.
 */
export function DestinationCard({ destination, variant = 'home', seasonLabel, details }: DestinationCardProps) {
  const id = `destination-${destination.slug}`;
  return (
    <a
      href={routes.destination(destination.slug)}
      className={styles.card}
      aria-labelledby={`${id}-name`}
      aria-describedby={`${id}-season`}
    >
      <MediaFrame image={destination.image} ratio={PHOTO[variant].ratio} sizes={PHOTO[variant].sizes} />
      <div className={styles.text}>
        <h3 id={`${id}-name`} className={styles.name}>
          {destination.name}
        </h3>
        <span id={`${id}-season`} className={styles.season}>
          {details ? (
            <>
              <span className={styles.bestShort}>{details.season}</span>
              <span className={styles.count}>{details.tours}</span>
            </>
          ) : (
            <>
              <span className={styles.label}>{seasonLabel}</span>
              <span className={styles.months}>{seasonRange(destination.bestSeason)}</span>
            </>
          )}
        </span>
      </div>
    </a>
  );
}
