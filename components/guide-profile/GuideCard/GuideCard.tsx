import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { guideAnchor, routes } from '@/lib/routes';
import type { GuideCardProps } from './GuideCard.types';
import styles from './GuideCard.module.css';

/** In a grid of at most four columns, each at least 150px (DESIGN.md §5): two on phones. */
const PHOTO_SIZES = '(width >= 820px) 25vw, 50vw';

/**
 * A guide or driver: portrait (a placeholder until the owner's photo, ADR-0009), name, then
 * role and base. On the Homepage the card is one link to their profile on the About page, named
 * by the guide. On About it's a button that opens the profile, with an id so
 * `/about#guide-{slug}` lands on it, named by its own words with the guide's name first.
 */
export function GuideCard(props: GuideCardProps) {
  const { guide } = props;
  const id = `guide-card-${guide.slug}`;

  if (props.variant === 'button') {
    const classes = [styles.card, styles.button, props.selected && styles.selected].filter(Boolean).join(' ');
    return (
      <button type="button" id={guideAnchor(guide.slug)} aria-haspopup="dialog" className={classes} onClick={props.onOpen}>
        {/* The portrait repeats the name, so it stays out of the button's name. */}
        <span aria-hidden="true" className={styles.portrait}>
          <MediaFrame image={guide.portrait} ratio="4:5" sizes={PHOTO_SIZES} className={styles.photo} />
        </span>
        {/* A button can't hold a heading, so the name is plain text. */}
        <span className={styles.text}>
          <span className={styles.name}>{guide.name}</span>
          <span className={styles.role}>
            {guide.role} · {guide.base}
          </span>
          <span className={styles.view}>{props.viewLabel}</span>
        </span>
      </button>
    );
  }

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
