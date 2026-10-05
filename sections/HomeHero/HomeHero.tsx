import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { routes } from '@/lib/routes';
import { displayLetters } from '@/lib/utils/displaySpacing';
import { whatsappLink } from '@/lib/utils/whatsapp';
import type { HomeHeroProps } from './HomeHero.types';
import styles from './HomeHero.module.css';

/**
 * The Homepage's full-screen photo, sliding under the sticky header. Layers: the photo (the
 * page's LCP image), the legibility scrim, and the dim layer the scroll motion darkens. Then
 * the lead, the two buttons and the decorative display word, which screen readers skip. Each of
 * its letters cancels its own side space, so the gaps between the letters' ink are all the same.
 */
export function HomeHero({ copy, settings }: HomeHeroProps) {
  const whatsappHref = whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage);

  return (
    <section className={styles.hero} data-surface="dark">
      <div className={styles.media}>
        <MediaFrame image={copy.image} ratio="fill" sizes="100vw" priority />
      </div>
      <div className={styles.scrim} />
      <div className={styles.dim} />
      <div className={styles.foot}>
        <div className={styles.row}>
          <p className={styles.lead}>{copy.lead}</p>
          <div className={styles.actions}>
            <Button href={routes.tours} arrow className={styles.action}>
              {copy.exploreLabel}
            </Button>
            <Button href={whatsappHref} variant="secondary" icon="whatsapp" className={styles.action}>
              {copy.whatsappLabel}
            </Button>
          </div>
        </div>
        <p className={styles.display} aria-hidden="true">
          {displayLetters(copy.displayWord).map(({ char, left, right }, i) => (
            <span key={i} className={styles.letter} style={{ '--lsb': left, '--rsb': right } as CSSProperties}>
              {char}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
