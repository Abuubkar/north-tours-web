import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import type { PhotoHeroProps } from './PhotoHero.types';
import styles from './PhotoHero.module.css';

/**
 * A page's photo hero (Tour Detail; Destination later), sliding under the sticky header: the
 * photo full-bleed under the legibility scrim, a back link at the top, and at the bottom a short
 * line, the page's only <h1> and its facts.
 */
export function PhotoHero({ image, back, kicker, title, children }: PhotoHeroProps) {
  return (
    <section className={styles.hero} data-surface="dark">
      <div className={styles.media}>
        <MediaFrame image={image} ratio="fill" sizes="100vw" priority />
      </div>
      <div className={styles.scrim} />
      <div className={styles.top}>
        <TextLink href={back.href} variant="back">
          {back.label}
        </TextLink>
      </div>
      <div className={styles.foot}>
        <p className={styles.kicker}>{kicker}</p>
        <h1 className={styles.title}>{title}</h1>
        {children}
      </div>
    </section>
  );
}
