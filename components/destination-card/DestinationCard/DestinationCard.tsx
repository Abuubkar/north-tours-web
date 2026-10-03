import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { routes } from '@/lib/routes';
import { seasonRange } from '@/lib/utils/dates';
import type { DestinationCardProps } from './DestinationCard.types';
import styles from './DestinationCard.module.css';

/** In a grid of at most six columns, each at least 160px (DESIGN.md §5): two on phones. */
const PHOTO_SIZES = '(width >= 1100px) 16vw, (width >= 600px) 33vw, 50vw';

/**
 * A destination with its photo and best season. The whole card is one link to the
 * destination's page, named by the destination; the season is its description.
 */
export function DestinationCard({ destination, seasonLabel }: DestinationCardProps) {
  const id = `destination-${destination.slug}`;
  return (
    <a
      href={routes.destination(destination.slug)}
      className={styles.card}
      aria-labelledby={`${id}-name`}
      aria-describedby={`${id}-season`}
    >
      <MediaFrame image={destination.image} ratio="3:4" sizes={PHOTO_SIZES} />
      <span className={styles.text}>
        <span id={`${id}-name`} className={styles.name}>
          {destination.name}
        </span>
        <span id={`${id}-season`} className={styles.season}>
          <span className={styles.label}>{seasonLabel}</span>
          <span className={styles.months}>{seasonRange(destination.bestSeason.from, destination.bestSeason.to)}</span>
        </span>
      </span>
    </a>
  );
}
