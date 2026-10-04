import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { routes } from '@/lib/routes';
import { seasonRange } from '@/lib/utils/dates';
import { fillTokens } from '@/lib/utils/tokens';
import type { DestinationCardProps } from './DestinationCard.types';
import styles from './DestinationCard.module.css';

/** In a grid of at most six columns (five on a destination page), each at least 160px (DESIGN.md §5): two on phones. */
const PHOTO_SIZES = { home: '(width >= 1100px) 16vw, (width >= 600px) 33vw, 50vw', other: '(width >= 1100px) 20vw, (width >= 600px) 33vw, 50vw' };

/**
 * A destination with its photo and best season. The whole card is one link to the destination's
 * page, named by the destination; the season (and, on a destination page, its tours) describes it.
 */
export function DestinationCard({ destination, variant = 'home', seasonLabel, tours }: DestinationCardProps) {
  const id = `destination-${destination.slug}`;
  const other = variant === 'other';
  return (
    <a
      href={routes.destination(destination.slug)}
      className={styles.card}
      aria-labelledby={`${id}-name`}
      aria-describedby={`${id}-season`}
    >
      <MediaFrame image={destination.image} ratio={other ? '4:3' : '3:4'} sizes={PHOTO_SIZES[variant]} />
      <div className={styles.text}>
        <h3 id={`${id}-name`} className={styles.name}>
          {destination.name}
        </h3>
        {other ? (
          <span id={`${id}-season`} className={styles.season}>
            <span className={styles.bestShort}>{fillTokens(seasonLabel, { season: seasonRange(destination.bestSeason, 'short') })}</span>
            <span className={styles.label}>{tours}</span>
          </span>
        ) : (
          <span id={`${id}-season`} className={styles.season}>
            <span className={styles.label}>{seasonLabel}</span>
            <span className={styles.months}>{seasonRange(destination.bestSeason)}</span>
          </span>
        )}
      </div>
    </a>
  );
}
