import type { CSSProperties } from 'react';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { coverSizes, HERO_MAX_HEIGHT } from '@/lib/utils/images';
import type { PhotoHeroProps } from './PhotoHero.types';
import styles from './PhotoHero.module.css';

/**
 * A page's photo hero (Tour Detail, Destination), starting below the header: the photo
 * full-bleed under the legibility scrim, a back link at the top, and at the bottom a short line,
 * the page's only <h1> and its facts. Destination: the name at display size, sized from its
 * length so it stays on one line, with the destination's lead under it.
 */
const heroClass = { tour: styles.hero, destination: `${styles.hero} ${styles.destination}` };

/** Each hero's tallest, for its photo's `sizes`. */
const heroHeight = { tour: HERO_MAX_HEIGHT.photoHero, destination: HERO_MAX_HEIGHT.destinationHero };

/** Tour: the tour hero size, wrapping as it needs. Destination: display size on one line (`--name-length`). */
const titleClass = { tour: styles.title, destination: styles.name };

export function PhotoHero({ variant = 'tour', image, back, kicker, title, lead, children }: PhotoHeroProps) {
  return (
    <section className={heroClass[variant]} data-surface="dark">
      <div className={styles.media}>
        <MediaFrame image={image} ratio="fill" sizes={coverSizes(image, heroHeight[variant])} priority />
      </div>
      <div className={styles.scrim} />
      <div className={styles.top}>
        <TextLink href={back.href} variant="back">
          {back.label}
        </TextLink>
      </div>
      <div className={styles.foot}>
        <p className={styles.kicker}>{kicker}</p>
        <h1 className={titleClass[variant]} style={{ '--name-length': title.length } as CSSProperties}>
          {title}
        </h1>
        {lead && <p className={styles.lead}>{lead}</p>}
        {children}
      </div>
    </section>
  );
}
