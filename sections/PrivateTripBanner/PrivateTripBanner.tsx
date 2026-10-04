import { Button } from '@/components/ui/Button/Button';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import type { PrivateTripBannerProps } from './PrivateTripBanner.types';
import styles from './PrivateTripBanner.module.css';

/** The photo's width: up to 560px, the full width on phones. */
const PHOTO_SIZES = '(width >= 640px) 560px, 100vw';

const variantClass = { results: styles.inResults, section: styles.ownSection };

/**
 * The offer of a private trip: a photo, the headline and lead, then the planner and WhatsApp.
 * Tours shows it inside the results after the first row, with a hairline below; a destination
 * page as its own section, with a hairline above.
 */
export function PrivateTripBanner({ copy, planHref, whatsappHref, variant = 'results' }: PrivateTripBannerProps) {
  return (
    <section className={variantClass[variant]}>
      <MediaFrame image={copy.image} ratio="16:10" sizes={PHOTO_SIZES} className={styles.media} />
      <div className={styles.text}>
        <h2 className={styles.headline}>{copy.headline}</h2>
        <p className={styles.lead}>{copy.lead}</p>
        <div className={styles.actions}>
          <Button href={planHref} arrow className={styles.action}>
            {copy.planLabel}
          </Button>
          <Button href={whatsappHref} variant="secondary" icon="whatsapp" className={styles.action}>
            {copy.askLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
