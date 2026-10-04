import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { guideAnchor, routes } from '@/lib/routes';
import type { GuideCardProps } from './GuideCard.types';
import styles from './GuideCard.module.css';

/** In a grid of at most four columns, each at least 150px (DESIGN.md §5): two on phones. */
const PHOTO_SIZES = '(width >= 820px) 25vw, 50vw';

/**
 * A guide or driver: portrait (a placeholder until the owner's photo, ADR-0009), name, then
 * role and base. On the Homepage the card is one link to their profile on the About page; on
 * About it's a button that opens the profile, with an id so `/about#guide-{slug}` lands on it.
 * Either way it's named by the guide.
 */
export function GuideCard(props: GuideCardProps) {
  const { guide } = props;
  const id = `guide-card-${guide.slug}`;
  // A button can't hold a heading, so on About the name is plain text; the Homepage's is an <h3>.
  const Name = props.variant === 'button' ? 'span' : 'h3';
  const text = (
    <>
      <MediaFrame image={guide.portrait} ratio="4:5" sizes={PHOTO_SIZES} className={styles.photo} />
      <span className={styles.text}>
        <Name id={`${id}-name`} className={styles.name}>
          {guide.name}
        </Name>
        <span id={`${id}-role`} className={styles.role}>
          {guide.role} · {guide.base}
        </span>
        {props.variant === 'button' && <span className={styles.view}>{props.viewLabel}</span>}
      </span>
    </>
  );

  if (props.variant === 'button') {
    return (
      <button
        type="button"
        id={guideAnchor(guide.slug)}
        aria-haspopup="dialog"
        aria-labelledby={`${id}-name`}
        aria-describedby={`${id}-role`}
        className={`${styles.card} ${styles.button} ${props.selected ? styles.selected : ''}`}
        onClick={props.onOpen}
      >
        {text}
      </button>
    );
  }

  return (
    <a href={routes.guide(guide.slug)} className={styles.card} aria-labelledby={`${id}-name`} aria-describedby={`${id}-role`}>
      {text}
    </a>
  );
}
