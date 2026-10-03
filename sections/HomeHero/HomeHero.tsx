import { Button } from '@/components/ui/Button/Button';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { routes } from '@/lib/routes';
import type { HomeHeroProps } from './HomeHero.types';
import styles from './HomeHero.module.css';

/**
 * The Homepage's full-screen photo, sliding under the sticky header. Layers: the photo (the
 * page's LCP image), the legibility scrim, and the dim layer the scroll motion darkens. Then
 * the lead, the two buttons and the decorative display word, which screen readers skip.
 */
export function HomeHero({ copy, whatsappHref }: HomeHeroProps) {
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
          {copy.displayWord}
        </p>
      </div>
    </section>
  );
}
